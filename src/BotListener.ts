import { Client } from 'discord.js';

export default interface BotListener {
  (client: Client): void
}
