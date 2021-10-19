import Discord from 'discord.js';
import { Score } from '../entity/Score';
import Client from '../struct/Client';

export default async function (
    this: Client,
    member: Discord.GuildMember
): Promise<unknown> {
    const memberCount =
        member.guild.memberCount -
        member.guild.members.cache.filter(member => member.user.bot).size;

    (<Discord.VoiceChannel>(
        this.channels.cache.get(this.config.ids.channels.memberCount)
    )).setName(`Member Count: ${memberCount}`);

    return this.db.manager.findOne(Score, member.id).then(score => {
        if (score) {
            this.sendLog({
                user: member.user,
                title: `${member.user.tag} left with points`,
                description: `**<@${member.id}>** (${member.user.tag}) has left the server, \`${score.score}\` points removed.`,
                type: 'NEGATIVE'
            });
            score.remove();
        }
    });
}
