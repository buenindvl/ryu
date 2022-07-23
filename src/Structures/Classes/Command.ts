import { CommandType } from "../Types/CommandType"

export class CommandBuilder {
  constructor(options: CommandType) {
    Object.assign(this, options)
  }
}