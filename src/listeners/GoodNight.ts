import {
    Client,
    Message,
} from 'discord.js';
import { toBinary } from 'utils/string';
import { elapsed } from 'utils/time';


const goodNightUtterances = [
    'boa noite',
]
const timeout = 1000 * 60 * 30;

function handleMessage(msg: Message) {
    if (msg.author.bot) {
        return;
    }
    console.log(JSON.stringify(msg));
    const isGoodnight = goodNightUtterances.filter(utterance => msg.content.toLocaleLowerCase().includes(utterance)).length > 0;
    if (!isGoodnight) {
        return;
    }
    const key = `good-night/${msg.channel.id}`;
    // if (elapsed(key, timeout)) {
    msg.reply(toBinary('Boa noite!'));
    //}

}

export default function setup(client: Client): void {
    client.on('message', handleMessage);
}
