import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { Client } from 'discord.js';
import BotListener from './BotListener';
import { Greetings, UserJoin, AutoJoin } from './listeners'


const client = new Client();

const listeners: BotListener[] = [
  Greetings,
  UserJoin,
  AutoJoin,
];


for (const listener of listeners) {
  listener(client);
}
// Start the bot
const token = process.env.DISCORD_BOT_TOKEN;
console.log('Starting');

client.on('ready', () => {
  client.user?.setActivity({
    name: 'com casadas',
    type: "PLAYING"
  });
})
client.login(token);
