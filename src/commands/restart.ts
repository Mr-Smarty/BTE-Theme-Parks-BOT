import Discord from 'discord.js';
import { ClientInfo } from '../entity/ClientInfo';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'restart',
    aliases: [],
    description: 'restarts the bot',
    permission: ['dev'],
    usage: 't=restart',
    async run(this: Command, _client: Client, message: Discord.Message, args: string[]) {
        const msg = await message.channel.send('Restarting...');
        const info = (await _client.db.manager.findOne(ClientInfo)) || new ClientInfo();

        info.id = _client.user.id;
        info.lastChannel = msg.channel.id;
        info.lastMessage = msg.id;

        await info.save();
        process.exit(0);
    }
});
