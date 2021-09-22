import Client from '../struct/client';
import Discord from 'discord.js';
import { Score } from '../entity/Score';

export default async function (
    this: Client,
    reaction: Discord.MessageReaction,
    user: Discord.User
): Promise<unknown> {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (user.bot) return;

    if (
        reaction.message.channel.id == this.config.ids.channels.progressUpdates &&
        reaction.emoji.name == '✅'
    ) {
        const user = reaction.message.author;
        let score = await this.db.manager.findOne(Score, user.id);

        if (score) {
            score.score++;
            await score.save();
        } else {
            score = new Score();
            score.id = user.id;
            score.score = 1;
            await score.save();
        }

        reaction.remove();
        reaction.message.react('☑');

        score.checkLevel(this, reaction.message.member);
    }
}
