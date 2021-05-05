import Discord from 'discord.js';
import Client from '../struct/client';

export default async function (this: Client, message: Discord.Message): Promise<unknown> {
    if (message.author.bot) return;
    if (!message.content.startsWith(this.config.prefix)) return;

    const body = message.content.slice(this.config.prefix.length).trim();
    const args = body.split(/ +/g) || [];
    const commandName = args.shift();
    if (!this.commands.has(commandName)) return;
    const command = this.commands.get(commandName);
    command.run(this, message, args);
}
