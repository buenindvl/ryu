import { SlashCommandBuilder } from "../../Structures/Classes/SlashCommand";
import { EmbedBuilder } from "discord.js";

export default new SlashCommandBuilder({
  name: "ping",
  description: "Bot Latency Ping.",
  run({ client, interaction }) {
    return interaction.reply({ content: "tudo certo aqui nos slash" })
  },
})