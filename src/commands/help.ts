import { Message } from 'discord.js';
import { Snippet } from '../entity/Snippet';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'help',
    aliases: ['info'],
    description: 'help command, lists snippets',
    permission: ['any'],
    usage: null,
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        let snippets = (
            await _client.db.manager.find(Snippet, { order: { id: 'ASC' } })
        ).map(snippet => `${_client.config.prefix}\`${snippet.name}\``);
        message.channel.send({
            embeds: [
                {
                    title: 'BuildTheEarth Theme Parks: Help',
                    thumbnail: {
                        url: _client.guild.iconURL({ format: 'png', dynamic: true })
                    },
                    description:
                        'The BuildTheEarth: Theme Parks team is an official BuildTheEarth team that builds theme parks and resorts internationally. We are a skilled group of builders whose final goal is to complete all the theme parks and connected resorts on Earth in Minecraft. To get started, please read <#714569270356475964> and <#704382947821748244>. For the latest news, check out <#704381561092571148>. You can use `=commands` to see all other commands available to you. Never hesitate to contact a staff team member if you have any questions, and have fun!',
                    fields: [
                        {
                            name: 'Available Info Commands',
                            value: snippets.join('\n') || '(none)'
                        }
                    ],
                    color: _client.config.colors.standard
                }
            ]
        });
    }
});
