import {
    Client,
    GuildMember,
    VoiceState,
    VoiceChannel,
    VoiceConnection,
    Guild,
} from 'discord.js';
import { elapsed } from 'utils/time';

const config = {
    delayUntilSend: 3000,
    cooldownPerUser: 1000 * 60 * 10,
    cooldownPerGuild: 1000 * 5,
}
const mainGuildId = process.env.DISCORD_MAIN_GUILD;
const joinRoleId = process.env.DISCORD_JOIN_ROLE;
const nickname = process.env.DISCORD_NICKNAME;

function handleReady(client: Client): () => Promise<void> {
    return async () => {
        if (mainGuildId) {
            for (const guild of client.guilds.cache.values()) {
                if (guild) {
                    const user = guild.voiceStates.cache
                        .filter(voiceState => voiceState.member != undefined && voiceState.channel != undefined && hasJoinRole(voiceState.member))
                        .first();
                    if (user && user.channel && user.member) {
                        const connection = await join(client, user.channel);
                        if (connection) {
                            await sayGoodnight(user.member, connection);
                        }
                    }
                }
            }
        }
    }
}

async function sayGoodnight(member: GuildMember, voice: VoiceConnection) {
    const guildId = voice.channel.guild.id;
    if (
        !elapsed(`voicegoodbye(guild:${guildId},user:${member.id})`, config.cooldownPerUser) ||
        !elapsed(`voicegoodbye:(guild:${guildId})`, config.cooldownPerGuild)
    ) return;

    console.log("should send boa noite to " + member.user.username + " at " + voice.channel.guild.name);
    
    setTimeout(async () => {
        await voice.play('./assets/boanoite.mp3');
    }, config.delayUntilSend);

}
async function join(client: Client, channel: VoiceChannel): Promise<VoiceConnection | null> {
    if (mainGuildId && joinRoleId) {
        const guild = channel.guild;
        if (guild?.voice?.channel && guild.voice.connection) {
            return null;
        }
        return await channel.join();
    }
    return null;
}

function hasJoinRole(member: GuildMember): boolean {
    // if (joinRoleId) {
    //     return (member.roles.cache.has(joinRoleId));
    // }
    return true;
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
        if (client.user && nickname) {
            const member = oldState.guild.member(client.user);
            if (member && member.nickname && member.nickname !== nickname) {
                await member.setNickname(nickname)
            }
        }

        // Ignore bots
        if (newState.member?.user.bot) {
            return;
        }
        // If member exists
        if (newState.member) {
            // If someone joined a voice channel
            if (!oldState.channel && newState.channel) {
                // If has the special role
                if (hasJoinRole(newState.member)) {
                    const voiceConnection = await join(client, newState.channel);
                    if (voiceConnection) {
                        await sayGoodnight(newState.member, voiceConnection);
                    }
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
                    await sayGoodnight(newState.member, guild.voice.connection);
                }
            }

        }

    });
}
