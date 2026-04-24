import { injectable, inject } from "tsyringe";
import { Discord, On, type ArgsOf } from "@rpbey/discordx";
import { LogService } from "~/services/LogService";

@Discord()
@injectable()
export class MessageLogEvent {
  constructor(@inject(LogService) private logs: LogService) {}

  @On({ event: "messageDelete" })
  async onDelete([message]: ArgsOf<"messageDelete">) {
    if (!message.guild || message.author?.bot) return;
    const embed = this.logs
      .makeEmbed("Message supprimé", 0xef4444)
      .addFields(
        { name: "Auteur", value: message.author ? `${message.author} (${message.author.id})` : "Inconnu", inline: true },
        { name: "Salon", value: `<#${message.channelId}>`, inline: true },
        { name: "Contenu", value: message.content ? message.content.slice(0, 1024) : "*(vide ou non caché)*" },
      );
    await this.logs.send(message.client, "message", embed);
  }

  @On({ event: "messageUpdate" })
  async onUpdate([oldM, newM]: ArgsOf<"messageUpdate">) {
    if (!newM.guild || newM.author?.bot || oldM.content === newM.content) return;
    const embed = this.logs
      .makeEmbed("Message modifié", 0xfbbf24)
      .addFields(
        { name: "Auteur", value: newM.author ? `${newM.author} (${newM.author.id})` : "Inconnu", inline: true },
        { name: "Salon", value: `<#${newM.channelId}>`, inline: true },
        { name: "Avant", value: (oldM.content || "*(vide)*").slice(0, 1024) },
        { name: "Après", value: (newM.content || "*(vide)*").slice(0, 1024) },
      );
    await this.logs.send(newM.client, "message", embed);
  }
}
