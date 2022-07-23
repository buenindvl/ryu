import { ChannelType, EmbedBuilder } from "discord.js";
import { Event } from "../../Structures/Classes/Event";

export default new Event({
  name: "messageCreate",
  run(client, message) {
    if (message.author.bot || !message.guild) return;

    if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;

    let [cmd, ...args] = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);

    let command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.get(client.aliases.get(cmd.toLowerCase()));
    
    if (!command) return

    if (command?.config?.developer && message.author.id !== client.application.owner.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Error")
            .setDescription(`\`\`\`Only my developer can use this command.\`\`\``)
        ]
      })
    }

    if (command?.config?.nsfw && message.channel.type === ChannelType.GuildText && !message.channel.nsfw) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Error")
            .setDescription(`\`\`\`You can only run this command in a NSFW enabled channel.\`\`\``)
        ]
      })
    }

    if (command?.config?.owner && message.author.id !== message.guild.ownerId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Error")
            .setDescription(`\`\`\`Only the owner of this server can run this command.\`\`\``)
        ]
      })
    }

    if (command?.permissions?.user && !message.member.permissions.has(command.permissions.user || [])) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Error")
            .setDescription(`\`\`\`You do not have the permissions to use this command.\`\`\``)
            .addFields([
              {
                name: "Permissions Needed:",
                value: `\`\`\`${command.permissions.user.join("\n")}\`\`\``
              }
            ])
        ]
      })
    }

    if (command?.permissions?.me && !message.guild.members.me.permissions.has(command.permissions.me || [])) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Error")
            .setDescription(`\`\`\`I do not have the permissions to run this command.\`\`\``)
            .addFields([
              {
                name: "Permissions Needed:",
                value: `\`\`\`${command.permissions.me.join("\n")}\`\`\``
              }
            ])

        ]
      })
    }

    command.run({ args, client, message })
  },
});
