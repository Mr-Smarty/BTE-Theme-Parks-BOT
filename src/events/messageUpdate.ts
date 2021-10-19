import Discord from 'discord.js';
import Client from '../struct/Client';

export default async function (
    this: Client,
    oldMessage: Discord.Message,
    newMessage: Discord.Message
): Promise<unknown> {
    if (newMessage.channel.id == this.config.ids.channels.hi) {
        let last = parseInt(oldMessage.content.match(/\d+/g)[0]);
        await newMessage.channel.send(
            `${newMessage.member} broke the chain at hi #${last} by editing their message!`
        );
        return newMessage.channel.send('hi #1');
    }
}
