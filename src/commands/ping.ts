import { Message } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'ping',
    aliases: [],
    description: 'ping command',
    permission: ['any'],
    usage: null,
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        let m = await message.channel.send('pong!');
        let ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`pong! \`${ping}ms\` | webscoket: \`${_client.ws.ping}ms\``);
    }
});
