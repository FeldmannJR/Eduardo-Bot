import { Client } from 'discord.js';
import { config as dotEnvConfig } from 'dotenv';
import BotListener from './BotListener';
import { GoodNight } from './listeners'

dotEnvConfig();

const client = new Client();

const listeners: BotListener[] = [
  GoodNight
];


for (const listener of listeners) {
  listener(client);
}
// Start the bot
const token = process.env.DISCORD_BOT_TOKEN;
console.log('Starting');
client.login(token);
