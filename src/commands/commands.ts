import { Message } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'commands',
    aliases: ['commands'],
    description: 'list commands or view info about a specific command',
    permission: ['any'],
    usage: '[command]',
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        if (typeof args[0] == 'string') {
            const command =
                _client.commands.get(args[0].toLowerCase()) ||
                _client.commands.find(command => {
                    return command.aliases.includes(args[0].toLowerCase());
                });
            if (!command) return message.channel.send('That command does not exist!');

            const permissions = command.permission.map(perm => {
                switch (perm) {
                    case 'any':
                        return 'none';
                    case 'dev':
                        return `<@!${_client.config.ownerId}>`;
                    default:
                        return `<@&${
                            message.guild?.roles.cache.findKey(
                                role => role.name.toLowerCase() == perm
                            ) || `${perm[0].toUpperCase()}${perm.slice(1)}`
                        }>`;
                }
            });

            let channelListString;
            if (command.channels) {
                let channelList = command.channels.map(channel => `<#${channel}>`);
                if (channelList.length > 1)
                    channelList.splice(channelList.length - 1, 0, 'or');
                channelListString = channelList.join(', ').replace('or,', 'or');
                if (channelList.length == 3)
                    channelListString = channelListString.replace(', or', ' or');
            }

            return message.channel.send({
                embeds: [
                    {
                        title: command.name,
                        description: command.description,
                        fields: [
                            {
                                name: 'Required Permissions',
                                value:
                                    permissions.join(', ') +
                                    '\n' +
                                    (channelListString || '')
                            },
                            {
                                name: 'Usage',
                                value: (Array.isArray(command.usage)
                                    ? command.usage
                                          .map(use => {
                                              return `\`${_client.config.prefix}${command.name} ${use}\``;
                                          })
                                          .join('\n')
                                    : `\`${_client.config.prefix}${command.name} ${command.usage}\``
                                ).replace(' null', '')
                            },
                            {
                                name: 'Aliases',
                                value: command.aliases[0]
                                    ? command.aliases
                                          .map(alias => {
                                              return `\`${alias}\``;
                                          })
                                          .join(', ')
                                    : 'none'
                            },
                            {
                                name: 'Restrictions',
                                value: command.dms ? '✅ DMs' : '❌ DMs'
                            }
                        ],
                        color: _client.config.colors.standard
                    }
                ]
            });
        }

        let availableCommands = _client.commands.map(command => {
            let permission = <string[]>command.permission;

            if (message.author.id == _client.config.ownerId || permission.includes('any'))
                return `**-** \`${command.name}\` ${command.description}`;
            if (
                _client
                    .anyMessageMember(message)
                    .roles.cache.some(role =>
                        permission.includes(role.name.toLowerCase())
                    )
            ) {
                let perms = new Set(permission);
                return `**-** \`${command.name}\` (${
                    [
                        ...new Set(
                            _client
                                .anyMessageMember(message)
                                .roles.cache.sort((a, b) => b.position - a.position)
                                .values()
                        )
                    ].filter(x => perms.has(x.name.toLowerCase()))[0].name
                }) ${command.description}`;
            }
        });

        message.channel.send({
            embeds: [
                {
                    title: `Available Commands${
                        message.author.id == _client.config.ownerId ? ' - `DEV`' : ''
                    }`,
                    description: availableCommands.filter(c => c).join('\n'),
                    fields: [
                        {
                            name: 'Usage Explanation',
                            value: `Arguments enclosed in \`<angle brackets>\` are required.
                            Arguments enclosed in \`[square brackets]\` are optional.
                            Arguments in \`'single quotes'\` means that you should type their name to choose an option (instead of coming up with your own value).
                            Arguments separated by \`vertical | bars\` means that you choose one of them.
                            These formats can be layered such as \`<this | that>\` or \`['enableOption']\`.`
                        },
                        {
                            name: 'More Info',
                            value: `For more information on a specific command, use \`${_client.config.prefix}commands <command name>\`.`
                        }
                    ],
                    footer: {
                        text: `The command prefix is ${_client.config.prefix}`
                    },
                    timestamp: new Date(),
                    color: _client.config.colors.standard
                }
            ]
        });
    }
});
