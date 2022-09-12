import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";
import { botConfig } from "./Config/botConfig";
import "../WebServer/link.ts"
import { RegisterCommands } from "./Interfaces/RegisterCommand";
import { CommandType } from "./Types/CommandType";
import { SlashCommandType } from "./Types/SlashCommandType";
import { ContextCommandType } from "./Types/ContextCommandType";

import { glob } from "glob";
import chalk from "chalk";
import { promisify } from "util";
import { Event } from "./Classes/Event";
let globPromise = promisify(glob)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  aliases: Collection<string, string> = new Collection()
  slashCommands: Collection<string, SlashCommandType | ContextCommandType> = new Collection();
  config = botConfig;

  constructor() {
    super({
      intents: [
        "DirectMessages",
        "GuildMembers",
        "GuildMessages",
        "GuildPresences",
        "Guilds",
        "MessageContent",
      ],
    });
  }

  start() {
    console.clear();
    this.login(this.config.token)
    this.loadFiles()
  }

  private async registerCommands({ commands, guild }: RegisterCommands) {
    console.log(chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━[ Client ]"))
    if (guild) {
      let server = this.guilds.cache.get(guild)
      await server?.commands.set(commands)
      console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Client")} ]`)} Loaded to: ${chalk.greenBright.bold(`${server.name}`)}`)
    } else {
      this?.application?.commands.set(commands)
      console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Client")} ]`)} Loaded to: ${chalk.greenBright.bold("All")}`)
    }
  }

  private async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  private async loadFiles() {
    let arrayCommands: ApplicationCommandDataResolvable[] = []

    let LegacyCommandFiles = await globPromise(`${__dirname}/../Commands/**/*{.ts,.js}`);
    console.log(chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━[ Legacy Commands ]"))
    if (LegacyCommandFiles.length == 0) console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Legacy Commands")} ]`)} Loaded: ${chalk.redBright.bold(`None Loaded`)}`)
    LegacyCommandFiles.forEach(async (filePath) => {
      let file: CommandType = await this.importFile(filePath)
      let splitted = filePath.split("/")
      let directory = splitted[splitted.length - 2]

      if (!file?.name) console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Legacy Commands")} ]`)} Loaded: ${chalk.redBright.bold("No Name")}`)

      if (file.name) {
        let properties = { ...file, directory }
        this.commands.set(file.name, properties)
        console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Legacy Commands")} ]`)} Loaded: ${chalk.greenBright.bold(`${file.name}`)}`)
      } if (file.aliases) {
        file.aliases.forEach(alias => this.aliases.set(alias, file.name))
      }
    })

    let SlashCommandFiles = await globPromise(`${__dirname}/../SlashCommands/**/*{.ts,.js}`);
    console.log(chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━[ Slash Commands ]"))
    if (SlashCommandFiles.length == 0) console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Slash Commands")} ]`)} Loaded: ${chalk.redBright.bold(`None Loaded`)}`)
    SlashCommandFiles.forEach(async (filePath) => {
      let file: SlashCommandType = await this.importFile(filePath)
      let splitted = filePath.split("/")
      let directory = splitted[splitted.length - 2]
      
      if (!file?.name) console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Legacy Commands")} ]`)} Loaded: ${chalk.redBright.bold("No Name")}`)

      if (file.name) {
        let properties = { ...file, directory }
        this.slashCommands.set(file.name, properties)
        arrayCommands.push(file)
        console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Slash Commands")} ]`)} Loaded: ${chalk.greenBright.bold(`${file.name}`)}`)
      }
    })

    this.on("ready", async () => {
      await this.registerCommands({
        commands: arrayCommands,
        // guild: "Your server ID",
      })
    })

    let EventFiles = await globPromise(`${__dirname}/../Events/**/*{.ts,.js}`);
    console.log(chalk.white.bold("━━━━━━━━━━━━━━━━━━━━━[ Events ]"))
    if (EventFiles.length == 0) console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Events")} ]`)} Loaded: ${chalk.redBright.bold(`None Loaded`)}`)
    EventFiles.forEach(async (filePath) => {
      let file: Event<keyof ClientEvents> = await this.importFile(filePath)

      if (file?.options.name) {
        if (file.options.once) {
          this.once(file.options.name, file.options.run.bind(null, this))
        } else {
          this.on(file.options.name, file.options.run.bind(null, this))
        }
        console.log(`${chalk.whiteBright.bold(`[ ${chalk.blueBright.bold("Events")} ]`)} Loaded: ${chalk.greenBright.bold(`${file.options.name}`)}`)
      } else {
        await this.importFile(filePath)
      }
    })
  }
}
