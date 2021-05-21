import Discord from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'ping',
    aliases: [],
    description: 'ping command',
    permission: ['any'],
    usage: 't=ping',
    async run(this: Command, _client: Client, message: Discord.Message, args: string[]) {
        message.channel.send('pong!');
    }
});
