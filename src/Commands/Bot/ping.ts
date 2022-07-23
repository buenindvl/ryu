import { CommandBuilder } from "../../Structures/Classes/Command";
import { EmbedBuilder } from "discord.js";

export default new CommandBuilder({
  name: "ping",
  description: "Shows Bot Latency Ping",
  run({ client, message }) {
    message.reply({ content: "🏓 Pong", embeds: [new EmbedBuilder().setColor("Random").setDescription(`**Bot Latency:** \`${client.ws.ping.toLocaleString()}ms\``)] })
  },
})