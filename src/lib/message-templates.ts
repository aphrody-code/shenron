/**
 * Catalogue centralisé des événements pour lesquels le bot envoie un message.
 *
 * Chaque entrée déclare :
 *   - `event`        — clé unique (PK de `message_templates`)
 *   - `description`  — affiché dans le dashboard
 *   - `defaultTemplate` — texte FR par défaut, avec placeholders `{var}`
 *   - `defaultChannelKey` — clé `guild_settings` du salon par défaut
 *   - `variables`    — liste des placeholders supportés (pour la doc UI)
 *   - `embed`        — true si le message doit être rendu dans un EmbedBuilder
 *
 * Le `MessageTemplateService` charge la table `message_templates` (cache 30s),
 * fusionne avec les défauts ci-dessous et expose `render(event, vars)`.
 */

export interface EventDef {
  event: string;
  description: string;
  defaultTemplate: string;
  defaultChannelKey:
    | "channel.announce"
    | "channel.achievement"
    | "channel.level"
    | "channel.welcome"
    | "channel.farewell"
    | "channel.giveaway"
    | "channel.mod_notify"
    | "channel.log_sanction";
  variables: { name: string; description: string }[];
  embed: boolean;
}

export const EVENTS: readonly EventDef[] = [
  {
    event: "welcome",
    description: "Message d'accueil pour un nouveau membre",
    defaultTemplate:
      "Bienvenue {user} sur **{guildName}** ! Tu es notre {memberCount}ème guerrier.",
    defaultChannelKey: "channel.welcome",
    variables: [
      { name: "user", description: "Mention du membre (<@id>)" },
      { name: "userName", description: "Pseudo affiché" },
      { name: "userId", description: "ID Discord du membre" },
      { name: "guildName", description: "Nom du serveur" },
      { name: "memberCount", description: "Nombre total de membres" },
      { name: "inviter", description: "Mention de l'invitant si tracké" },
    ],
    embed: true,
  },
  {
    event: "farewell",
    description: "Message de départ quand un membre quitte le serveur",
    defaultTemplate: "{userName} a quitté le serveur. Adieu, guerrier.",
    defaultChannelKey: "channel.farewell",
    variables: [
      { name: "userName", description: "Pseudo du membre parti" },
      { name: "userId", description: "ID Discord" },
      { name: "memberCount", description: "Nombre restant" },
    ],
    embed: true,
  },
  {
    event: "level_up",
    description: "Annonce de passage de palier (niveau XP)",
    defaultTemplate: "{user} a atteint **{xp} XP** — palier {level} débloqué !",
    defaultChannelKey: "channel.level",
    variables: [
      { name: "user", description: "Mention du membre" },
      { name: "userName", description: "Pseudo" },
      { name: "level", description: "Nouveau niveau atteint (1-10)" },
      { name: "xp", description: "XP totale du membre" },
      { name: "roleId", description: "ID du rôle attribué" },
      { name: "zeniBonus", description: "Bonus zénis offert" },
    ],
    embed: true,
  },
  {
    event: "achievement_unlocked",
    description: "Débloquage d'un succès",
    defaultTemplate: "{user} débloque l'accomplissement **{code}** !",
    defaultChannelKey: "channel.achievement",
    variables: [
      { name: "user", description: "Mention du membre" },
      { name: "userName", description: "Pseudo" },
      { name: "code", description: "Code du succès (ex: KAMEHAMEHA)" },
      { name: "description", description: "Description du succès si configurée" },
    ],
    embed: true,
  },
  {
    event: "first_message",
    description: "Premier message d'un membre (auto-attribué)",
    defaultTemplate: "{user} débloque l'accomplissement **Premier message** !",
    defaultChannelKey: "channel.achievement",
    variables: [
      { name: "user", description: "Mention du membre" },
      { name: "userName", description: "Pseudo" },
    ],
    embed: true,
  },
  {
    event: "daily_quest",
    description: "Récompense de la quête quotidienne (premier message du jour)",
    defaultTemplate:
      "{user} récupère **{zeni} zénis** pour son entraînement quotidien (streak {streak} jours).",
    defaultChannelKey: "channel.announce",
    variables: [
      { name: "user", description: "Mention" },
      { name: "zeni", description: "Zénis gagnés" },
      { name: "streak", description: "Jours consécutifs" },
    ],
    embed: true,
  },
  {
    event: "anti_link_jail",
    description: "Auto-jail quand un lien Discord externe est posté",
    defaultTemplate: "{user} a été jailé automatiquement (lien Discord externe détecté).",
    defaultChannelKey: "channel.log_sanction",
    variables: [
      { name: "user", description: "Mention" },
      { name: "url", description: "URL détectée" },
    ],
    embed: true,
  },
  {
    event: "jail_expired",
    description: "Auto-déjail à l'expiration de la peine",
    defaultTemplate: "{user} a été libéré du jail (peine expirée).",
    defaultChannelKey: "channel.log_sanction",
    variables: [
      { name: "user", description: "Mention" },
      { name: "userName", description: "Pseudo" },
      { name: "duration", description: "Durée de la peine" },
    ],
    embed: true,
  },
  {
    event: "giveaway_winner",
    description: "Annonce du gagnant d'un tirage",
    defaultTemplate: "Tirage terminé ! {winners} remporte(nt) **{prize}** ! Bravo guerriers.",
    defaultChannelKey: "channel.giveaway",
    variables: [
      { name: "winners", description: "Liste des mentions gagnantes" },
      { name: "prize", description: "Lot mis en jeu" },
      { name: "title", description: "Titre du tirage" },
    ],
    embed: true,
  },
  {
    event: "vocal_tempo_created",
    description: "Création d'un vocal éphémère",
    defaultTemplate: "Vocal éphémère créé pour {user}.",
    defaultChannelKey: "channel.announce",
    variables: [
      { name: "user", description: "Mention du créateur" },
      { name: "channelId", description: "ID du salon vocal" },
    ],
    embed: true,
  },
  {
    event: "vocal_tempo_destroyed",
    description: "Suppression d'un vocal éphémère vide",
    defaultTemplate: "Vocal éphémère supprimé (inactivité 60s).",
    defaultChannelKey: "channel.announce",
    variables: [{ name: "channelId", description: "ID du salon supprimé" }],
    embed: true,
  },
] as const;

export function findEvent(event: string): EventDef | undefined {
  return EVENTS.find((e) => e.event === event);
}

/**
 * Substitution `{var}` → valeur. Variables manquantes laissées telles quelles
 * pour faciliter le debug. Échappe rien — les templates sont admin-only donc
 * pas d'XSS, et le contenu va dans Discord (pas du HTML).
 */
export function renderTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (m, key) => {
    const v = vars[key];
    if (v === undefined || v === null) return m;
    return String(v);
  });
}
