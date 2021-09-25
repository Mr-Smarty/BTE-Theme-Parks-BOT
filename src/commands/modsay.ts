import { Message, TextChannel } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'modSay',
    aliases: ['say'],
    description: '[ classified ]',
    permission: ['moderator'],
    usage: '<channel> <message>',
    channels: [
        '718967630169505883',
        '739239527431798805',
        '788889231820062722',
        '704382590039097395',
        '709948821597323274'
    ],
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        let channel = <TextChannel>message.mentions.channels.first();
        if (!channel) return message.channel.send('Please mention a channel.');

        if (!args[1]) return message.channel.send('Please enter a message');

        channel.send(args.slice(1).join(' '));
        message.react('✅');
        return _client.sendLog({
            user: message.author,
            description: `<@${message.author.id}>** (${
                message.author.tag
            }) used the command \`=modSay\` to **<#${
                channel.id
            }>** with the following message:**\n${args.slice(1).join(' ')}`,
            extra: { 'Sender ID': message.author.id }
        });
    }
});
