import Discord, { ClientEvents } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';
import { Config } from '../typings';
import events from '../util/events';
import { execSync } from 'child_process';

export default new Command({
    name: 'reload',
    aliases: [],
    description: 'reload command, event, or file',
    permission: ['dev'],
    usage: "<command | 'config' | 'count'> ['build']",
    async run(this: Command, _client: Client, message: Discord.Message, args: string[]) {
        if (!args[0]) return;
        const arg = args[0].toLowerCase();

        switch (arg) {
            case 'config':
                delete require.cache[require.resolve('../../config.json')];
                _client.config = require('../../config.json') as Config;
                message.channel.send('Reloaded the config.');
                break;

            case 'count':
                let channel: Discord.GuildChannel = _client.channels.cache.get(
                    _client.config.ids.channels.memberCount
                ) as Discord.GuildChannel;
                await channel.setName(
                    `Member Count: ${
                        _client.guild.memberCount -
                        _client.guild.members.cache.filter(member => member.user.bot).size
                    }`
                );
                message.channel.send('Reloaded the member count.');
                break;

            default:
                if (!_client.commands.has(arg) && !events.includes(args[0]))
                    return message.channel.send(
                        `The command, event, or option \`${args[0]}\` doesn't exist!`
                    );

                if (args[1]?.toLowerCase() == 'build') {
                    let msg = await message.channel.send('Rebuilding javascript...');
                    execSync('npm run build');
                    msg.edit('Rebuilt javascript.');
                }

                if (_client.commands.has(arg)) {
                    delete require.cache[require.resolve(`./${arg}`)];
                    const command: Command = (await import(`./${arg}.js`)).default;
                    _client.commands.set(arg, command);
                    message.channel.send(`Reloaded the command \`${args[0]}\`.`);
                } else {
                    let eventName: keyof ClientEvents = args[0] as keyof ClientEvents;
                    _client.off(eventName, _client.events.get(eventName));
                    delete require.cache[require.resolve(`../events/${args[0]}`)];
                    let event = (await import(`../events/${args[0]}.js`)).default;
                    _client.events.set(eventName, event.bind(_client));
                    _client.on(eventName, _client.events.get(eventName));
                    message.channel.send(`Reloaded the event \`${args[0]}\`.`);
                }
                break;
        }
    }
});
