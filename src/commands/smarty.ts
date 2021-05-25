import Discord from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'restart',
    aliases: [],
    description: 'restarts the bot',
    permission: ['dev'],
    usage: 't=restart',
    async run(this: Command, _client: Client, message: Discord.Message, args: string[]) {
        message.channel.send('The best staff.');
    }
});
