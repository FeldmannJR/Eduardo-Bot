import {
    Client,
    GuildMember,
    VoiceState,
    VoiceChannel,
} from 'discord.js';

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
async function join(client: Client, channel: VoiceChannel) {
    if (mainGuildId && joinRoleId) {
        const guild = client.guilds.cache.get(mainGuildId);
        if (guild?.voice?.channel) {
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
        }
    });
}
