import {
  ChatInputApplicationCommandData,
  GuildMember,
  ChatInputCommandInteraction,
  PermissionResolvable,
  CommandInteractionOptionResolver,
} from "discord.js";
import { ExtendedClient } from "../Client";

export interface ExtendedInteraction extends ChatInputCommandInteraction {
  member: GuildMember;
}

interface runChatInput {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type Run = (options: runChatInput) => any;

export type SlashCommandType = {
  directory?: string
  /** Command configuration */
  config?: {
    /** Developer Command */
    developer?: boolean
    /** NSFW channel only command */
    nsfw?: boolean
    /** Server owner only command */
    owner?: boolean
  }
  /** Command permissions */
  permissions?: {
    /** Required user permissions */
    user?: PermissionResolvable[]
    /** Me required permissions */
    me?: PermissionResolvable[]
  }
  /** Running the command */
  run: Run
} & ChatInputApplicationCommandData