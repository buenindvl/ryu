import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommands {
  commands: ApplicationCommandDataResolvable[]
  guild?: string
}