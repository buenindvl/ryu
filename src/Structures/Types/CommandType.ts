import { ExtendedClient } from "../Client";
import { Message, PermissionResolvable } from "discord.js";

interface runOptions {
  client: ExtendedClient
  message: Message
  args: string[]
}

type Run = (options: runOptions) => any


export type CommandType = {
  /** Name of the command */
  name: string
  /** Aliases for the command */
  aliases?: string[]
  /** Descriptions of the command */
  description: string
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
}