import { Message } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'eval',
    aliases: ['run'],
    description: 'Execute javascript code',
    permission: ['dev'],
    usage: 't=eval <code>',
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        const raw = args.join(' ');

        let code = /^```(js)?(\s+)?.+(\s+)?```$/.test(raw)
            ? raw.replace(/(^```(js)?)|(```$)/g, '')
            : raw;

        if (code.includes('await')) code = `(async () => {${code}})()`;

        let status = undefined;
        try {
            const response = await Promise.resolve(eval(code));
            message.channel.send({
                embed: {
                    title: 'Response:',
                    color: _client.config.colors.standard,
                    description: String(response) || '\u200b'
                }
            });
            status = 'Success';
        } catch (error) {
            message.channel.send(`Error executing code:\n\`\`\`${error.stack}\`\`\``);
            status = 'Failed';
        } finally {
            _client.sendLog({
                user: _client.user,
                description: `${message.member}** (${message.author.tag}) attempted to eval the following code:**\n\`\`\`js\n${code}\`\`\`\n[Click here for context.](${message.url})`,
                extra: {
                    'Author ID': message.author.id,
                    'Outcome': status
                }
            });
        }
    }
});
