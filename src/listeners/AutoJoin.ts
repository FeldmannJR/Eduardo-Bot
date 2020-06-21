import {
    Client,
    GuildMember,
    VoiceState,
    VoiceChannel,
    VoiceConnection,
    Guild,
} from 'discord.js';

import { elapsed } from 'utils/time';
const mainGuildId = process.env.DISCORD_MAIN_GUILD;
const joinRoleId = process.env.DISCORD_JOIN_ROLE;


function handleReady(client: Client): () => Promise<void> {
    return async () => {
        if (mainGuildId) {
            const guild = client.guilds.cache.get(mainGuildId);
            if (guild) {
                const user = guild.voiceStates.cache
                    .filter(voiceState => voiceState.member != undefined && voiceState.channel != undefined && hasJoinRole(voiceState.member))
                    .first();
                if (user && user.channel) {
                    await join(client, user.channel);
                }
            }
        }
    }
}

async function sayGoodnight(voice: VoiceConnection) {
    console.log("should send boa noite");
    setTimeout(async () => {
        await voice.play('./assets/boanoite.mp3');
    }, 1000);

}
async function join(client: Client, channel: VoiceChannel) {
    if (mainGuildId && joinRoleId) {
        const guild = client.guilds.cache.get(mainGuildId);
        if (guild?.voice?.channel && guild.voice.connection) {
            return;
        }
        await channel.join();
    }
}

function hasJoinRole(member: GuildMember): boolean {
    if (joinRoleId) {
        return (member.roles.cache.has(joinRoleId));
    }
    return false;
}
function isConnected(guild: Guild, channel: VoiceChannel): boolean {
    if (guild?.voice?.channel?.id === channel.id) {
        return true;
    }
    return false;
}

export default function setup(client: Client): void {
    client.on('ready', handleReady(client));
    client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
        // Update name
        if (client.user) {
            const member = oldState.guild.member(client.user);
            if (member && member.nickname && member.nickname !== "Eduardo Amaro II") {
                await member.setNickname("Eduardo Amaro II")
            }
        }

        // If member exists
        if (newState.member && newState.guild.id === mainGuildId) {
            // If someone joined a voice channel
            if (!oldState.channel && newState.channel) {
                // If has the special role
                if (hasJoinRole(newState.member)) {
                    await join(client, newState.channel);
                }
            }
            // If someone leaved a voice channel
            if (oldState.channel && !newState.channel) {
                const channel = oldState.channel;
                if (isConnected(channel.guild, channel)) {
                    if (channel.members.size === 1) {
                        channel.guild.voice?.connection?.disconnect();
                        return
                    }
                }
            }
            if (newState.channel &&
                newState.guild.voice &&
                newState.channel.id !== oldState?.channel?.id &&
                newState.channel.id === newState.guild?.voice?.channel?.id
            ) {
                const guild = newState.channel.guild;
                if (guild.voice && guild.voice.connection) {
                    if (elapsed("voicegoodbye:" + newState.member.id, 1000 * 60 * 10) && elapsed('voicegoodbye', 1000 * 5)) {
                        await sayGoodnight(guild.voice.connection);
                    }
                }
            }

        }

    });
}
