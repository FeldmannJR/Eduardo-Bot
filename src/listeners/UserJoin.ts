import {
    Client,
    GuildMember,
    PartialGuildMember,
} from 'discord.js';


async function handleJoin(member: GuildMember | PartialGuildMember) {
    if (member.guild.systemChannel) {
        await member.guild.systemChannel.send(`Eae gatinha, <@${member.id}>, tem zapzap?`);
    }
}


export default function setup(client: Client): void {
    client.on('guildMemberAdd', handleJoin);
}
