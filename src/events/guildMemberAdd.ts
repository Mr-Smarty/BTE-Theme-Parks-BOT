import Discord from 'discord.js';
import Client from '../struct/Client';

export default async function (
    this: Client,
    member: Discord.GuildMember
): Promise<unknown> {
    const memberCount =
        member.guild.memberCount -
        member.guild.members.cache.filter(member => member.user.bot).size;

    return (<Discord.VoiceChannel>(
        this.channels.cache.get(this.config.ids.channels.memberCount)
    )).setName(`Member Count: ${memberCount}`);
}
