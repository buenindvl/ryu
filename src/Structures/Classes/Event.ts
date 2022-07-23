import { ClientEvents } from "discord.js";
import { ExtendedClient } from "../Client";

interface EventOptions<Key extends keyof ClientEvents> { name: Key, once?: boolean, run: (client: ExtendedClient, ...args: ClientEvents[Key]) => any }

export class Event<Key extends keyof ClientEvents> {
  constructor(public options: EventOptions<Key>) {}
}
