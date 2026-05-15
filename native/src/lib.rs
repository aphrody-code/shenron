//! Crate natif pour shenron (Bun/TS) — exposé via napi-rs.
//!
//! Cible : hot-path computations utilisées plusieurs fois par requête / event.
//! Reste léger (zero dep runtime au-delà de napi) pour un binaire ~250kb stripped.
//!
//! Fonctions :
//! - `level_for_xp` / `next_threshold_from`  — calcul niveau DBZ + progression
//! - `fnv1a_hex` — hash FNV-1a 32-bit utilisé pour les ETag du cache HTTP
//! - `parse_duration_ms` / `format_duration` — pour les sanctions (warn/jail/mute)
//!
//! Les valeurs des thresholds sont dupliquées depuis `src/lib/constants.ts` :
//! si tu changes l'une, mets l'autre à jour (test d'égalité fait dans
//! `tests/native.test.ts`).

use napi_derive::napi;

/// Paliers XP DBZ (niveau, xp_threshold). Doit matcher `LEVEL_THRESHOLDS` côté TS.
const LEVEL_THRESHOLDS: &[(u32, i64)] = &[
    (1, 1_000),
    (2, 5_000),
    (3, 10_000),
    (4, 25_000),
    (5, 50_000),
    (6, 100_000),
    (7, 250_000),
    (8, 500_000),
    (9, 1_000_000),
    (10, 9_000_000),
];

/// Renvoie le niveau atteint pour un XP donné. 0 si en-dessous du palier 1.
#[napi]
pub fn level_for_xp(xp: i64) -> u32 {
    let mut level = 0u32;
    for &(l, threshold) in LEVEL_THRESHOLDS {
        if xp >= threshold {
            level = l;
        } else {
            break;
        }
    }
    level
}

/// Progression vers le prochain palier. `None` si déjà au niveau max.
#[napi(object)]
pub struct XpProgress {
    pub current: i64,
    pub next_level: u32,
    pub next_level_xp: i64,
    pub needed: i64,
}

#[napi]
pub fn next_threshold_from(xp: i64) -> Option<XpProgress> {
    LEVEL_THRESHOLDS
        .iter()
        .find(|(_, t)| *t > xp)
        .map(|(l, t)| XpProgress {
            current: xp,
            next_level: *l,
            next_level_xp: *t,
            needed: t - xp,
        })
}

/// Hash FNV-1a 32-bit sur les bytes UTF-8 de l'input, renvoie l'hex.
/// Utilisé pour générer les ETag des routes `/api/public/*`.
#[napi]
pub fn fnv1a_hex(input: String) -> String {
    let mut h: u32 = 0x811c_9dc5;
    for &b in input.as_bytes() {
        h ^= b as u32;
        h = h.wrapping_mul(0x0100_0193);
    }
    format!("{h:08x}")
}

/// Parse `"10m"`, `"1h"`, `"7d"`, `"2w"` → millisecondes. None si format invalide.
/// Compatible avec `parseDuration(input)` de `lib/sanction-helpers.ts`.
#[napi]
pub fn parse_duration_ms(s: String) -> Option<i64> {
    let trimmed = s.trim();
    if trimmed.is_empty() {
        return None;
    }
    let bytes = trimmed.as_bytes();
    let mut i = 0usize;
    while i < bytes.len() && bytes[i].is_ascii_digit() {
        i += 1;
    }
    if i == 0 {
        return None;
    }
    let n: i64 = trimmed[..i].parse().ok()?;
    let mut j = i;
    while j < bytes.len() && bytes[j].is_ascii_whitespace() {
        j += 1;
    }
    if j >= bytes.len() {
        return None;
    }
    let unit = bytes[j].to_ascii_lowercase();
    let mult: i64 = match unit {
        b's' => 1_000,
        b'm' => 60_000,
        b'h' => 3_600_000,
        b'd' => 86_400_000,
        b'w' => 604_800_000,
        _ => return None,
    };
    // Vérif : pas de trailing characters significatifs après l'unité.
    if bytes[j + 1..].iter().any(|c| !c.is_ascii_whitespace()) {
        return None;
    }
    n.checked_mul(mult)
}

/// Format d'une durée en ms vers `"3j"`, `"4h"`, `"15min"`, `"42s"`.
#[napi]
pub fn format_duration(ms: i64) -> String {
    let abs = ms.unsigned_abs();
    if abs >= 86_400_000 {
        return format!("{}j", div_round(abs, 86_400_000));
    }
    if abs >= 3_600_000 {
        return format!("{}h", div_round(abs, 3_600_000));
    }
    if abs >= 60_000 {
        return format!("{}min", div_round(abs, 60_000));
    }
    format!("{}s", div_round(abs, 1_000))
}

#[inline]
fn div_round(n: u64, d: u64) -> u64 {
    (n + d / 2) / d
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn xp_levels() {
        assert_eq!(level_for_xp(0), 0);
        assert_eq!(level_for_xp(999), 0);
        assert_eq!(level_for_xp(1_000), 1);
        assert_eq!(level_for_xp(4_999), 1);
        assert_eq!(level_for_xp(5_000), 2);
        assert_eq!(level_for_xp(202_347), 6);
        assert_eq!(level_for_xp(9_000_000), 10);
        assert_eq!(level_for_xp(50_000_000), 10);
    }

    #[test]
    fn xp_progress_basics() {
        let p = next_threshold_from(202_347).expect("not max");
        assert_eq!(p.next_level, 7);
        assert_eq!(p.next_level_xp, 250_000);
        assert_eq!(p.needed, 47_653);
        assert!(next_threshold_from(10_000_000).is_none());
    }

    #[test]
    fn fnv1a_known_vectors() {
        // FNV-1a 32-bit empty = 0x811c9dc5
        assert_eq!(fnv1a_hex(String::new()), "811c9dc5");
        // FNV-1a 32-bit "a" = 0xe40c292c
        assert_eq!(fnv1a_hex("a".to_string()), "e40c292c");
        // "foobar" = 0xbf9cf968
        assert_eq!(fnv1a_hex("foobar".to_string()), "bf9cf968");
    }

    #[test]
    fn duration_parse() {
        assert_eq!(parse_duration_ms("10m".to_string()), Some(600_000));
        assert_eq!(parse_duration_ms("1h".to_string()), Some(3_600_000));
        assert_eq!(parse_duration_ms("7d".to_string()), Some(604_800_000));
        assert_eq!(parse_duration_ms("2w".to_string()), Some(1_209_600_000));
        assert_eq!(parse_duration_ms("  30s  ".to_string()), Some(30_000));
        assert_eq!(parse_duration_ms("".to_string()), None);
        assert_eq!(parse_duration_ms("abc".to_string()), None);
        assert_eq!(parse_duration_ms("10x".to_string()), None);
    }

    #[test]
    fn duration_format() {
        assert_eq!(format_duration(500), "1s");
        assert_eq!(format_duration(45_000), "45s");
        assert_eq!(format_duration(120_000), "2min");
        assert_eq!(format_duration(7_200_000), "2h");
        assert_eq!(format_duration(172_800_000), "2j");
    }
}
