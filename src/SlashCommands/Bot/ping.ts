import { SlashCommandBuilder } from "../../Structures/Classes/SlashCommand";
import { EmbedBuilder } from "discord.js";

export default new SlashCommandBuilder({
  name: "ping",
  description: "Bot Latency Ping.",
  run({ client, interaction }) {
    return interaction.reply({ content: "🏓 Pong", embeds: [new EmbedBuilder().setColor("Random").setDescription(`**Bot Latency:** \`${client.ws.ping.toLocaleString()}ms\``)] })
  },
})