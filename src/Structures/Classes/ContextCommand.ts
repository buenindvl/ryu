import { ContextCommandType } from "../Types/ContextCommandType"

export class ContextCommandBuilder {
  constructor(options: ContextCommandType) {
    Object.assign(this, options)
  }
}