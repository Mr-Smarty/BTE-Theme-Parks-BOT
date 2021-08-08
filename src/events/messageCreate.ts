import Discord from 'discord.js';
import Client from '../struct/client';
import { UpdateCooldown } from '../entity/UpdateCooldown';
import msToDuration from '../util/msToDuration';
import promiseTimeout from '../util/promiseTimeout';

export default async function (this: Client, message: Discord.Message): Promise<unknown> {
    if (message.author.bot) return;

    //================ COOLDOWN ================//

    if (message.channel.id == this.config.ids.channels.progressUpdates) {
        const cooldown = await UpdateCooldown.findOne({
            where: { member: message.member.id }
        });

        if (cooldown) {
            let now = new Date();
            let later = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            let duration = msToDuration(+later - +now);

            message.delete();
            const sent = await message.channel.send(
                `You have already posted a progress update today. Please wait ${duration.hr} hours, ${duration.min} minutes before posting another update.`
            );
            return promiseTimeout(() => sent.delete(), 10000);
        } else {
            let newCooldown = new UpdateCooldown();
            newCooldown.member = message.member.id;
            return newCooldown.save();
        }
    }

    //================ SUGGESTIONS ================//

    if (message.channel.id === this.config.ids.channels.suggestions) {
        if (!message.content.startsWith('#')) {
            await message.delete();
            let msg = await message.channel.send(
                'Please Number your suggestion in the format `#number suggestion content`.'
            );
            return promiseTimeout(() => msg.delete(), 7500);
        }
        await message.react(this.config.ids.emojis.upvote);
        await message.react('🤷‍♂️');
        return await message.react(this.config.ids.emojis.downvote);
    }

    //================ HI ======================//

    if (message.channel.id == this.config.ids.channels.hi) {
        let messages = await message.channel.messages.fetch({ limit: 2 });
        let lower = parseInt(messages.last().content.match(/\d+/g)[0]);
        if (/^hi #\d+$/g.test(message.content.trim())) {
            if (parseInt(messages.first().content.match(/\d+/g)[0]) !== lower + 1) {
                await message.channel.send(
                    `${message.member} broke the chain at hi #${lower + 1}.`
                );
                message.channel.send('hi #1');
            }

            if (messages.last().author.id == message.author.id) {
                await message.channel.send(
                    `${message.member} broke the chain at hi #${
                        lower + 1
                    } by sending multiple in a row.`
                );
                message.channel.send('hi #1');
            }
        } else {
            await message.channel.send(
                `${message.member} broke the chain at hi #${lower + 1}.`
            );
            message.channel.send('hi #1');
        }
    }

    //================ COMMANDS ================//

    if (!message.content.startsWith(this.config.prefix)) return;

    const body = message.content.slice(this.config.prefix.length).trim();
    const args = body.split(/ +/g) || [];
    const commandName = args.shift().toLowerCase();
    const command =
        this.commands.get(commandName) ||
        this.commands.find(command => {
            return command.aliases.includes(commandName);
        });

    if (!command) return;
    if (!message.guild && !command.dms) return;
    if (command.channels) {
        if (!command.channels.includes(message.channel.id)) return;
    }
    if (
        !message.member.roles.cache.some(role => {
            return (command.permission as string[]).includes(role.name.toLowerCase());
        }) &&
        !(command.permission as string[]).includes('any') &&
        message.member.id !== this.config.ownerId
    )
        return;

    try {
        command.run(this, message, args);
    } catch (error) {
        message.channel.send({
            embeds: [
                {
                    title: 'An error occured!',
                    color: this.config.colors.negative
                }
            ]
        });
        console.error(error);
    }
}
