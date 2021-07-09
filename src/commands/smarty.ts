import { Message } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'smarty',
    aliases: [],
    description: '¯\\_(ツ)_/¯',
    permission: ['any'],
    usage: null,
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        message.channel.send('The best staff.');
    }
});
