#!/usr/bin/env bash
# Healthcheck prod shenron — état services + timers + endpoints HTTP + disque/mem.
# Usage : bash scripts/healthcheck.sh        (résumé lisible)
#         bash scripts/healthcheck.sh --quiet (code retour uniquement : 0 = tout OK)
set -uo pipefail

QUIET=0; [ "${1:-}" = "--quiet" ] && QUIET=1
RC=0
say(){ [ "$QUIET" = 0 ] && echo -e "$@"; }

SERVICES=(shenron shenron-site shenron-mcp shenron-embed filebrowser postgresql nginx)
ONESHOT_TIMERS=(shenron-backup shenron-pg-backup shenron-neon-sync shenron-neon-pull)

say "\033[1m=== Services ===\033[0m"
for s in "${SERVICES[@]}"; do
  st=$(systemctl is-active "$s" 2>/dev/null)
  if [ "$st" = active ]; then say "  \033[32m●\033[0m $s : active"
  else say "  \033[31m✗\033[0m $s : $st"; RC=1; fi
done

say "\n\033[1m=== Unités en échec ===\033[0m"
FAILED=$(systemctl --failed --no-pager --plain 2>/dev/null | grep -c '\.service' || true)
if [ "${FAILED:-0}" -gt 0 ]; then
  systemctl --failed --no-pager 2>/dev/null | grep '\.service' | while read -r l; do say "  \033[31m✗\033[0m $l"; done
  RC=1
else say "  \033[32m●\033[0m aucune"; fi

say "\n\033[1m=== Endpoints HTTP ===\033[0m"
check_url(){ # nom url code_attendu
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 8 "$2" 2>/dev/null)
  if [ "$code" = "$3" ]; then say "  \033[32m●\033[0m $1 : $code"
  else say "  \033[31m✗\033[0m $1 : $code (attendu $3)"; RC=1; fi
}
check_url "site  dragonballfr.com"       "https://dragonballfr.com/"              200
check_url "bot   /health"                "https://bot.dragonballfr.com/health"    200
check_url "mcp   /health"                "https://mcp.dragonballfr.com/health"    200
check_url "files login"                  "https://files.dragonballfr.com/"        200

say "\n\033[1m=== Ressources ===\033[0m"
say "  disque / : $(df -h / | awk 'NR==2{print $5" utilisé, "$4" libre"}')"
say "  mémoire  : $(free -h | awk '/Mem:/{print $3" / "$2" ("$7" dispo)"}')"

say "\n\033[1m=== Derniers backups ===\033[0m"
for d in shenron-sqlite shenron-pg; do
  last=$(ls -t "/home/ubuntu/shenron/data/backups/$d/" 2>/dev/null | head -1)
  say "  $d : ${last:-AUCUN}"
  [ -z "$last" ] && RC=1
done

[ "$QUIET" = 0 ] && { [ "$RC" = 0 ] && say "\n\033[32m✔ Tout est vert\033[0m" || say "\n\033[31m✘ Anomalies détectées\033[0m"; }
exit $RC
