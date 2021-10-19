import { Formatters, Message, TextChannel } from 'discord.js';
import { Snippet } from '../entity/Snippet';
import Client from '../struct/Client';
import Command from '../struct/Command';
import isSnippetRes from '../util/isSnippetRes';

export default new Command({
    name: 'snippets',
    aliases: ['snippets', 'tag', 'tags'],
    description: 'Manage custom info commands/snippets',
    permission: ['admin'],
    usage: ["<'add'> <'text' | 'embed'>", "<'delete'> <name>", "<'source'> <name>"],
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        switch (args[0]?.toLowerCase()) {
            case 'add': {
                if (!args[1] || args[1]?.length > 32)
                    return message.channel.send(
                        'You must give a snippet name less than 32 characters!'
                    );
                if (
                    args[2]?.toLowerCase() !== 'text' &&
                    args[2]?.toLowerCase() !== 'embed'
                )
                    return message.channel.send(
                        'You must specify the snippet type as `text` or `embed`.'
                    );
                if (!args[3]) return message.channel.send('You must enter a response!');

                let snippet = await _client.db.manager.findOne(
                    Snippet,
                    args[1].toLowerCase()
                );
                if (snippet) return message.channel.send('This snippet already exists!');

                let res = args.slice(3).join(' ');

                if (args[2].toLowerCase() == 'text') {
                    if (res.length > 2000)
                        return message.channel.send(
                            'The response length cannot be greater than 2000 characters!'
                        );
                    let snippet = new Snippet();
                    snippet.id = args[1].toLowerCase();
                    snippet.embed = false;
                    snippet.name = args[1];
                    snippet.textContent = res;
                    await snippet.save();
                    message.react('✅');
                    return _client.sendLog({
                        user: message.author,
                        description: `<@!${message.author.id}> ** (${message.author.tag}) created a new snippet:**\n\`=${snippet.name}\`: ${snippet.textContent}`,
                        extra: { 'User ID': message.author.id },
                        type: 'POSITIVE'
                    });
                } else {
                    if (!res.startsWith('{') || !res.endsWith('}'))
                        return message.channel.send(
                            'An embed response must be input as JSON data.'
                        );

                    let embedRes;
                    try {
                        embedRes = JSON.parse(res);
                    } catch (e) {
                        return message.channel.send(
                            `Error parsing JSON data:\n\`\`\`${e}\`\`\``
                        );
                    }

                    if (embedRes && Object.keys(embedRes).length === 0)
                        return message.channel.send('JSON cannot be empty.');

                    if (!isSnippetRes(embedRes))
                        return message.channel.send(
                            'JSON data can only contains the keys `title`, `url`, `author`, `description`, `thumbnail`, `fields`, `image`, and `footer`.'
                        );
                    else {
                        let msg = await message.channel.send('Testing embed response...');
                        try {
                            let test = await (<TextChannel>(
                                _client.channels.cache.get(
                                    _client.config.ids.channels.modBotCommands
                                )
                            )).send({ embeds: [embedRes] });
                            msg.edit('Test passed! ✅');
                            test.delete();
                        } catch (error) {
                            return msg.edit(
                                `Test failed! ❌\n\`\`\`${error.stack}\`\`\``
                            );
                        }

                        let snippet = new Snippet();
                        snippet.id = args[1].toLowerCase();
                        snippet.embed = true;
                        snippet.name = args[1];
                        snippet.embedContent = embedRes;
                        await snippet.save();
                        message.react('✅');
                        setTimeout(() => msg.delete(), 3000);
                        return _client.sendLog({
                            user: message.author,
                            description: `<@!${message.author.id}> ** (${message.author.tag}) created a new snippet:**\n\`=${snippet.name}\` It responds with an embed.`,
                            extra: { 'User ID': message.author.id },
                            type: 'POSITIVE'
                        });
                    }
                }
            }

            case 'delete': {
                if (!args[1])
                    return message.channel.send('You must give a snippet name!');

                let snippet = await _client.db.manager.findOne(
                    Snippet,
                    args[1].toLowerCase()
                );
                if (!snippet) return message.channel.send('That snippet does not exist!');

                message.channel
                    .send(
                        `Are you sure you would like to delete the snippet \`${snippet.name}\`? Type \`yes\` to confirm or \`no\` to cancel.`
                    )
                    .then(() => {
                        const filter = m =>
                            m.author.id == message.author.id &&
                            (m.content.toLowerCase() == 'yes' ||
                                m.content.toLowerCase() == 'no');
                        message.channel
                            .awaitMessages({
                                filter,
                                max: 1,
                                time: 16000,
                                errors: ['time']
                            })
                            .then(async response => {
                                switch (response.first().content.toLowerCase()) {
                                    case 'yes':
                                        _client.sendLog({
                                            user: message.author,
                                            description: `<@!${message.author.id}>** (${
                                                message.author.tag
                                            }) deleted the snippet:**\n\`=${
                                                snippet.name
                                            }\`: ${
                                                snippet.embed
                                                    ? 'Here is its embed response data:\n```' +
                                                      JSON.stringify(
                                                          snippet.embedContent,
                                                          null,
                                                          2
                                                      ) +
                                                      '```'
                                                    : snippet.textContent
                                            }`,
                                            extra: { 'User ID': message.author.id },
                                            type: 'NEGATIVE'
                                        });
                                        await snippet.remove();
                                        return response.first().react('✅');
                                    case 'no':
                                        message.channel.send('Operation cancelled.');
                                        break;
                                }
                            })
                            .catch(() => {
                                message.channel.send('Operation cancelled: timed out');
                            });
                    });

                break;
            }

            case 'source': {
                if (!args[1])
                    return message.channel.send('You must give a snippet name!');

                let snippet = await _client.db.manager.findOne(
                    Snippet,
                    args[1].toLowerCase()
                );
                if (!snippet) return message.channel.send('That snippet does not exist!');
                return message.channel.send(
                    Formatters.codeBlock(
                        snippet.textContent ||
                            JSON.stringify(snippet.embedContent, null, 2)
                    )
                );
            }

            default:
                if (args[0] == undefined)
                    return message.channel.send('Please specify a subcommand.');
                return message.channel.send('That subcommand does not exist!');
        }
    }
});
