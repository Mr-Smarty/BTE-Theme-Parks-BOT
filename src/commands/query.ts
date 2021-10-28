import { Message, Util } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'query',
    aliases: ['db'],
    description: 'Execute database query',
    permission: ['dev'],
    usage: '<query>',
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        const raw = args.join(' ');

        let query = /^```(sql)?(\s+)?.+(\s+)?```$/.test(raw)
            ? raw.replace(/(^```(sql)?)|(```$)/g, '')
            : raw;

        let status = undefined;
        try {
            const out = JSON.stringify(await _client.db.query(query), null, 2);
            message.channel.send({
                embeds: [
                    {
                        title: 'Response:',
                        color: _client.config.colors.standard,
                        description:
                            '```' + Util.splitMessage(out, { append: ' ...' })[0] + '```'
                    }
                ]
            });
            status = 'Success';
        } catch (error) {
            const err = error.message || '\u200B';
            message.channel.send(`Error executing query:\n\`\`\`${err}\`\`\``);
            status = 'Failed';
        } finally {
            _client.sendLog({
                user: _client.user,
                description: `${_client.anyMessageMember(message)}** (${
                    message.author.tag
                }) attempted to query the following:**\n\`\`\`sql\n${query}\`\`\`\n[Click here for context.](${
                    message.url
                })`,
                extra: {
                    'Author ID': message.author.id,
                    'Outcome': status
                }
            });
        }
    }
});
