import {
    Client,
    Message,
} from 'discord.js';
import { randomInteger } from 'utils/random';

const chance = parseInt(process.env.RANDOM_MESSAGE_CHANCE || '2000');

async function handleMessage(message: Message) {
    if (message.author.bot || message.author.system) {
        return;
    }

    if (randomInteger(0, chance) === 0) {
        // Send message


    }
}


export default function setup(client: Client): void {
    client.on('message', handleMessage);
}
