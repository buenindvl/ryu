import { ChannelType, CommandInteractionOptionResolver, ContextMenuCommandInteraction, EmbedBuilder } from "discord.js";
import { Event } from "../../Structures/Classes/Event";
import { ContextCommandType } from "../../Structures/Types/ContextCommandType";
import { ExtendedInteraction, SlashCommandType } from "../../Structures/Types/SlashCommandType";

export default new Event({
  name: "interactionCreate",
  run(client, interaction) {
    if (interaction.isChatInputCommand()) {
      let command = client.slashCommands.get(interaction.commandName) as SlashCommandType

      if (!command) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("⚠️ Error")
              .setDescription(`\`\`\`The command used was not found.\`\`\``)
              .setColor("Red")
          ],
          ephemeral: true
        })
      }

      if (command?.config?.developer && interaction.user.id !== client.application.owner.id) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("⚠️ Error")
              .setDescription(`\`\`\`Only my developer can use this command.\`\`\``)
          ],
          ephemeral: true
        })
      }

      if (command?.config?.nsfw && interaction.channel.type === ChannelType.GuildText && !interaction.channel.nsfw) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("⚠️ Error")
              .setDescription(`\`\`\`You can only run this command in a NSFW enabled channel.\`\`\``)
          ],
          ephemeral: true
        })
      }

      if (command?.config?.owner && interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("⚠️ Error")
              .setDescription(`\`\`\`Only the owner of this server can use this command.\`\`\``)
          ],
          ephemeral: true
        })
      }

      if (command?.permissions?.user && !interaction.memberPermissions.has(command.permissions.user || [])) {
        return interaction.reply({
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
          ],
          ephemeral: true
        })
      }

      if (command?.permissions?.me && !interaction.guild.members.me.permissions.has(command.permissions.me || [])) {
        return interaction.reply({
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
          ],
          ephemeral: true
        })
      }

      command.run({ 
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction
      })
    }

    if (interaction.isContextMenuCommand()) {
      let command = client.slashCommands.get(interaction.commandName) as ContextCommandType

      command.run({
        client,
        interaction
      })
    }
  },
})