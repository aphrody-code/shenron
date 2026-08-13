#!/usr/bin/env bash
# Watchdog auto-remédiation prod — tourne toutes les 5 min via
# shenron-watchdog.timer. Trois volets :
#
#   1. Endpoints HTTP (site/bot/mcp) : 2 échecs consécutifs (~10 min) →
#      `nginx reload` (cheap, sans coupure) ; 3 échecs consécutifs (~15 min) →
#      restart du service applicatif concerné (shenron-site/shenron/shenron-mcp),
#      rate-limité (cooldown 30 min) pour ne jamais partir en boucle de restart
#      si le problème est structurel (mauvais déploiement, DB down…).
#   2. Mémoire par service (shenron/shenron-site, sous cgroup MemoryMax) : au
#      dessus de 90% → restart préventif ("sauver" le process avant que le
#      cgroup OOM-kill le SIGKILL en plein milieu d'une écriture SQLite/PG).
#      Les deux services ont déjà Restart=always : ceci ne fait qu'anticiper
#      un restart de toute façon inévitable, en le rendant propre (arrêt net
#      vs SIGKILL cgroup).
#   3. Swap : si usage > 70% ET RAM dispo largement suffisante pour absorber
#      le swap-in (`swapoff -a` doit rapatrier les pages en RAM), purge
#      (`swapoff -a && swapon -a`) pour défragmenter — rate-limité (cooldown
#      2 h). Si la RAM dispo est trop juste, on saute la purge (swapoff
#      pourrait lui-même déclencher un OOM) et on laisse le check #2 gérer la
#      pression mémoire réelle.
#
# Toutes les actions sont loggées sur stdout (capté par journalctl -u
# shenron-watchdog). Pas d'alerting externe pour l'instant (à ajouter si
# besoin — webhook Discord dédié ops).
#
# Usage : bash scripts/watchdog.sh (idempotent, safe en cron/timer)
set -uo pipefail

STATE_DIR="${STATE_DIR:-/tmp/shenron-watchdog}"
mkdir -p "$STATE_DIR"
ts(){ date -u '+%Y-%m-%d %H:%M:%S UTC'; }
log(){ echo "[$(ts)] $*"; }

# ── état (compteurs d'échecs consécutifs + cooldowns) ───────────────────────
get_fail(){ cat "$STATE_DIR/fail-$1" 2>/dev/null || echo 0; }
set_fail(){ echo "$2" > "$STATE_DIR/fail-$1"; }
cooldown_ok(){ # $1=clé $2=minutes — true si aucune action recente (ou jamais)
  local marker="$STATE_DIR/cooldown-$1"
  [ -f "$marker" ] || return 0
  local age_min
  age_min=$(( ($(date +%s) - $(stat -c %Y "$marker" 2>/dev/null || echo 0)) / 60 ))
  [ "$age_min" -ge "$2" ]
}
mark_cooldown(){ touch "$STATE_DIR/cooldown-$1"; }

restart_service(){ # $1=nom systemd $2=cooldown-min $3=raison
  if ! cooldown_ok "restart-$1" "$2"; then
    log "  · restart $1 sauté (cooldown $2 min actif) — raison: $3"
    return
  fi
  log "  ⟲ restart $1 — raison: $3"
  sudo systemctl restart "$1"
  mark_cooldown "restart-$1"
}

# ── 1. endpoints HTTP + remédiation nginx/service ───────────────────────────
check_endpoint(){ # $1=clé $2=url $3=code_attendu $4=service_a_restart
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 8 "$2" 2>/dev/null || echo 000)
  if [ "$code" = "$3" ]; then
    if [ "$(get_fail "$1")" != "0" ]; then log "  ✓ $1 rétabli ($code)"; fi
    set_fail "$1" 0
    return
  fi
  local fail=$(( $(get_fail "$1") + 1 ))
  set_fail "$1" "$fail"
  log "  ✗ $1 : HTTP $code (attendu $3) — échec consécutif #$fail"
  if [ "$fail" -eq 2 ]; then
    log "  ↻ reload nginx (1re remédiation, $1)"
    sudo systemctl reload nginx 2>&1 | sed 's/^/    /'
  elif [ "$fail" -ge 3 ]; then
    restart_service "$4" 30 "$1 en échec depuis $fail cycles (~$((fail*5)) min)"
  fi
}

log "=== watchdog run ==="
say_section(){ log "-- $1 --"; }

say_section "endpoints"
check_endpoint site "https://dragonballfr.com/"           200 shenron-site
check_endpoint bot  "https://bot.dragonballfr.com/health" 200 shenron
check_endpoint mcp  "https://mcp.dragonballfr.com/health" 200 shenron-mcp

# ── 2. mémoire par service (cgroup vs MemoryMax) ────────────────────────────
say_section "mémoire services"
check_service_memory(){ # $1=service
  local cur max
  cur=$(systemctl show "$1" -p MemoryCurrent --value 2>/dev/null)
  max=$(systemctl show "$1" -p MemoryMax --value 2>/dev/null)
  if [ -z "$cur" ] || [ -z "$max" ] || [ "$cur" = "[not set]" ] || [ "$max" = "infinity" ] || [ "$max" = "0" ]; then
    log "  · $1 : MemoryCurrent/MemoryMax indisponible, check sauté"
    return
  fi
  local pct=$(( cur * 100 / max ))
  log "  $1 : ${pct}% (cur=$((cur/1024/1024))M / max=$((max/1024/1024))M)"
  if [ "$pct" -ge 90 ]; then
    restart_service "$1" 30 "mémoire à ${pct}% de MemoryMax (préventif, évite le SIGKILL cgroup)"
  fi
}
check_service_memory shenron
check_service_memory shenron-site

# ── 3. swap ──────────────────────────────────────────────────────────────────
say_section "swap"
read -r _ swap_total swap_used _ < <(free | awk '/Swap:/{print}')
mem_avail=$(free | awk '/Mem:/{print $7}')
if [ "${swap_total:-0}" -gt 0 ]; then
  swap_pct=$(( swap_used * 100 / swap_total ))
  log "  swap : ${swap_pct}% utilisé (${swap_used}K / ${swap_total}K), RAM dispo ${mem_avail}K"
  if [ "$swap_pct" -ge 70 ]; then
    # Marge de sécurité : la RAM dispo doit pouvoir absorber le swap-in complet
    # (swapoff rapatrie TOUTES les pages swappées) sans re-déclencher un OOM.
    if [ "$mem_avail" -ge $(( swap_used * 2 )) ]; then
      if cooldown_ok "swap-purge" 120; then
        # `swapon -a` ne réactive QUE les entrées de /etc/fstab. Le swap de cet
        # hôte (/swapfile-build) a été activé à la main et n'y figure pas : le
        # couple `swapoff -a && swapon -a` le supprimait donc DÉFINITIVEMENT
        # (vécu le 2026-08-13 — machine laissée sans swap juste après un OOM).
        # On mémorise les volumes actifs et on les réactive explicitement.
        mapfile -t swap_devs < <(swapon --show=NAME --noheadings 2>/dev/null)
        log "  ↻ purge swap (${#swap_devs[@]} volume(s) : ${swap_devs[*]:-aucun}) — marge RAM suffisante"
        sudo swapoff -a 2>&1 | sed 's/^/    /'
        for dev in "${swap_devs[@]}"; do
          [ -n "$dev" ] || continue
          sudo swapon "$dev" 2>&1 | sed 's/^/    /'
        done
        # Filet : réactive aussi ce que fstab déclare (si les deux coexistent).
        sudo swapon -a 2>/dev/null
        if [ "$(swapon --show=NAME --noheadings 2>/dev/null | wc -l)" -eq 0 ] && [ "${#swap_devs[@]}" -gt 0 ]; then
          log "  ✗ ALERTE : le swap n'a PAS pu être réactivé après la purge"
        fi
        mark_cooldown "swap-purge"
        free -h | sed 's/^/    /'
      else
        log "  · purge swap sautée (cooldown 120 min actif)"
      fi
    else
      log "  · swap élevé mais RAM dispo insuffisante pour purger sans risque — laissé au check mémoire par service"
    fi
  fi
else
  log "  aucun swap configuré"
fi

# ── 4. units systemd en échec + timers arrêtés ──────────────────────────────
# Angle mort corrigé le 2026-08-13 : shenron-neon-pull a échoué en boucle du
# 2026-07-11 au 2026-08-13 (3 doublons "Goku" en base bloquaient le reverse-sync)
# sans que RIEN ne le signale — les volets 1-3 ne regardent que les endpoints
# HTTP et la mémoire, or un timer oneshot qui échoue ne dégrade aucun endpoint :
# le site restait vert pendant que le replica du bot pourrissait (167 épisodes
# de retard côté /wiki Discord et RAG). Seul `healthcheck.sh`, manuel, le voyait.
say_section "units en échec"
failed_units=$(systemctl list-units 'shenron*' --state=failed --no-legend --plain 2>/dev/null | awk '{print $1}')
if [ -z "$failed_units" ]; then
  log "  ✓ aucune unit shenron* en échec"
else
  for u in $failed_units; do
    log "  ✗ ALERTE : $u en échec — diagnostic: journalctl -u $u -n 50"
    # Une seule relance par heure : si la cause est une donnée invalide (cas
    # vécu), réessayer toutes les 5 min ne répare rien et noie le journal.
    if cooldown_ok "failed-$u" 60; then
      log "    ⟲ tentative de relance"
      sudo systemctl reset-failed "$u" 2>&1 | sed 's/^/      /'
      sudo systemctl start "$u" 2>&1 | sed 's/^/      /'
      mark_cooldown "failed-$u"
    else
      log "    · relance sautée (cooldown 60 min) — échec persistant, intervention requise"
    fi
  done
fi

# Un timer désactivé/arrêté ne "échoue" jamais : il ne tourne simplement plus.
# Cas silencieux tout aussi grave (sync figée), donc vérifié explicitement.
say_section "timers actifs"
for t in shenron-neon-sync shenron-neon-pull shenron-backup shenron-pg-backup shenron-watchdog; do
  state=$(systemctl is-active "$t.timer" 2>/dev/null || true)
  if [ "$state" = "active" ]; then
    log "  ✓ $t.timer actif"
  else
    log "  ✗ ALERTE : $t.timer ${state:-inconnu} (attendu: active) — sync/backup à l'arrêt"
  fi
done

log "=== fin ==="
