import {
    Client,
    Message,
} from 'discord.js';
import { toBinary } from 'utils/string';
import { elapsed } from 'utils/time';

const timeout = 1000 * 60 * 30;


const greetings =
    [
        {
            input: ['boa noite'],
            output: 'Boa noite!'
        },
        {
            input: ['boa tarde'],
            output: "Boa tarde pessoal!"
        },
        {
            input: ['bom dia'],
            output: 'Bom dia amigos! '
        }
    ];


function findGreetings(input: string) {
    const lowerCase = input.toLocaleLowerCase();
    return greetings.filter(
        greeting => greeting.input.filter(utterance => lowerCase.includes(utterance)).length > 0
    )[0];

}


function handleMessage(msg: Message) {
    if (msg.author.bot || msg.author.system) {
        return;
    }
    if (!msg.content) {
        return;
    }
    const greetings = findGreetings(msg.content);

    if (!greetings) {
        return;
    }
    const key = `${greetings.input[0]}/${msg.author.id}`;
    if (elapsed(key, timeout)) {
        console.log("Sending " + greetings.output + " to " + msg.author.username);
        msg.reply(toBinary(greetings.output));
    }

}


export default function setup(client: Client): void {
    client.on('message', handleMessage);
}
