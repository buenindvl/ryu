import { SlashCommandType } from "../Types/SlashCommandType"

export class SlashCommandBuilder {
  constructor(options: SlashCommandType) {
    Object.assign(this, options)
  }
}