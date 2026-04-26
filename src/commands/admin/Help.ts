import { Discord, Slash, MetadataStorage, type DApplicationCommand } from "@rpbey/discordx";
import {
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  type CommandInteraction,
} from "discord.js";
import { env } from "~/lib/env";

// Mapping statique nom de commande → groupe (premier match l'emporte). Pour
// les sous-commandes (slash group), on regarde aussi `command.group`.
const GROUPS: Array<{ title: string; cmds: Set<string>; groups?: Set<string>; modOnly?: boolean }> =
  [
    {
      title: "Profil & XP",
      cmds: new Set(["profil", "top", "stats", "scan", "eprofil"]),
    },
    {
      title: "Économie",
      cmds: new Set(["solde", "shop", "buy", "fusion", "defusion"]),
    },
    {
      title: "Fun & Jeux",
      cmds: new Set(["gay", "raciste", "translate", "pendu", "morpion", "bingo", "pfc"]),
    },
    {
      title: "Wiki & Recherche",
      cmds: new Set(["wiki", "races", "planete"]),
    },
    {
      title: "Tickets & Vocal",
      cmds: new Set(["close", "ticket", "voc"]),
    },
    {
      title: "Giveaway",
      cmds: new Set(["giveaway"]),
    },
    {
      title: "Modération",
      cmds: new Set([
        "warn",
        "unwarn",
        "warns",
        "clearwarns",
        "mute",
        "unmute",
        "jail",
        "unjail",
        "ban",
        "unban",
        "kick",
        "clear",
        "role",
        "sstats",
        "slowmode",
        "lock",
        "unlock",
        "nick",
        "note",
      ]),
      modOnly: true,
    },
    {
      title: "Admin & Config",
      cmds: new Set(["niveau", "zeni", "custom", "ticket-panel", "ids"]),
      groups: new Set(["config", "succes", "admin"]),
      modOnly: true,
    },
  ];

@Discord()
export class HelpCommand {
  @Slash({ name: "help", description: "Liste des commandes du bot" })
  async help(interaction: CommandInteraction) {
    // Récupère toutes les slash registrées sur le guild courant
    const all = MetadataStorage.instance.applicationCommandSlashesFlat;
    const guildId = env.GUILD_ID;
    const onGuild = all.filter((c) => {
      const guilds = c.guilds ?? [];
      // Si pas de botGuilds définis sur la commande, c'est global → on l'inclut quand même
      if (guilds.length === 0) return true;
      return guilds.some((g) => (Array.isArray(g) ? g.includes(guildId) : g === guildId));
    });

    // Détermine si l'auteur a la perm modération (pour afficher les commandes mod)
    const memberPerms = interaction.memberPermissions ?? new PermissionsBitField();
    const canSeeMod =
      memberPerms.has(PermissionsBitField.Flags.ModerateMembers) ||
      memberPerms.has(PermissionsBitField.Flags.Administrator);

    // Indexe pour buckets : nom unique avec préfixe groupe si présent
    const labelOf = (c: DApplicationCommand): string => {
      if (c.group && c.subgroup) return `/${c.group} ${c.subgroup} ${c.name}`;
      if (c.group) return `/${c.group} ${c.name}`;
      return `/${c.name}`;
    };

    // Bucketise
    const buckets = new Map<string, string[]>();
    for (const g of GROUPS) buckets.set(g.title, []);
    const fallback: string[] = [];

    for (const c of onGuild) {
      let placed = false;
      for (const g of GROUPS) {
        if (g.modOnly && !canSeeMod) continue;
        const matched = (c.group && g.groups?.has(c.group)) || g.cmds.has(c.name);
        if (matched) {
          buckets.get(g.title)!.push(`**${labelOf(c)}** — ${c.description}`);
          placed = true;
          break;
        }
      }
      if (!placed) fallback.push(`**${labelOf(c)}** — ${c.description}`);
    }

    // Construit les embeds (un seul si possible, splitte si > 4096 chars)
    const sections: string[] = [];
    for (const g of GROUPS) {
      const lines = buckets.get(g.title)!;
      if (lines.length === 0) continue;
      lines.sort();
      sections.push(`**__${g.title}__**\n${lines.join("\n")}`);
    }
    if (fallback.length > 0) {
      fallback.sort();
      sections.push(`**__Autres__**\n${fallback.join("\n")}`);
    }

    const embeds: EmbedBuilder[] = [];
    let buf = "";
    const MAX = 4000; // marge sous 4096
    for (const section of sections) {
      const next = buf ? `${buf}\n\n${section}` : section;
      if (next.length > MAX && buf) {
        embeds.push(new EmbedBuilder().setColor(0xffa500).setDescription(buf));
        buf = section;
      } else {
        buf = next;
      }
    }
    if (buf) embeds.push(new EmbedBuilder().setColor(0xffa500).setDescription(buf));
    if (embeds.length === 0) {
      embeds.push(
        new EmbedBuilder().setColor(0xffa500).setDescription("Aucune commande disponible."),
      );
    }
    embeds[0]!.setTitle("Commandes Shenron");

    await interaction.reply({ embeds, flags: MessageFlags.Ephemeral });
  }
}
