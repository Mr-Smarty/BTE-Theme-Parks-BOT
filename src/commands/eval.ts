import { Message, Util } from 'discord.js';
import Client from '../struct/Client';
import Command from '../struct/Command';
import stringifyAnything from '../util/stringifyAnything';

export default new Command({
    name: 'eval',
    aliases: ['run'],
    description: 'Execute javascript code',
    permission: ['dev'],
    usage: '<code>',
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        if (!args[0]) return message.channel.send('Theres nothing to eval!');
        const raw = args.join(' ');

        let code = /^```(js)?(\s+)?.+(\s+)?```$/.test(raw)
            ? raw.replace(/(^```(js)?)|(```$)/g, '')
            : raw;

        if (code.includes('await')) code = `(async () => {${code}})()`;

        let status = undefined;
        try {
            let response = await Promise.resolve(eval(code));
            response = Util.splitMessage(stringifyAnything(response), {
                maxLength: 1990,
                char: '',
                append: ' ...'
            });
            message.channel.send({
                embeds: [
                    {
                        title: 'Response:',
                        color: _client.config.colors.standard,
                        description: Array.isArray(response)
                            ? '```js\n' + response[0] + '\n```'
                            : '```js\n' + response + '\n```'
                    }
                ]
            });
            status = 'Success';
        } catch (error) {
            message.channel.send(`Error executing code:\n\`\`\`${error.stack}\`\`\``);
            status = 'Failed';
        } finally {
            _client.sendLog({
                user: _client.user,
                description: `${_client.anyMessageMember(message)}** (${
                    message.author.tag
                }) attempted to eval the following code:**\n\`\`\`js\n${code}\`\`\`\n[Click here for context.](${
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
