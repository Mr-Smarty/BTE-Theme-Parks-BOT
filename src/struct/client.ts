import Discord from 'discord.js';
import { Connection, createConnection } from 'typeorm';
import Command from './Command';
import fs from 'fs/promises';
import Google from 'google-spreadsheet';
import { Log, GoogleCredentials, Config } from '../typings';
import { UpdateCooldown } from '../entity/UpdateCooldown';

export default class Client extends Discord.Client {
    db: Connection;
    config: Config;
    commands: Discord.Collection<string, Command>;

    constructor(config) {
        super({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
        this.config = config;
        this.commands = new Discord.Collection<string, Command>();
    }

    async initDatabase(): Promise<void> {
        this.db = await createConnection();
    }

    /**
     * Sends a log to the log channel
     * @example
     * client.sendLog({
     *     user: Discord.User,
     *     title?: string,
     *     description?: string,
     *     fields?: Discord.EmbedField[],
     *     extra?: Record<string, string | number>,
     *     type?: 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE'
     * })
     */
    async sendLog(data: Log): Promise<Discord.Message> {
        const log = new Discord.MessageEmbed({
            title: data.title,
            description: data.description,
            fields: data.fields,
            author: {
                name: data.user.tag,
                icon_url: data.user.displayAvatarURL({ format: 'png', dynamic: true }),
                url: `https://discordapp.com/users/${data.user.id}/`
            },
            timestamp: new Date()
        });

        switch (data.type) {
            case 'POSITIVE':
                log.setColor(this.config.colors.positive);
                break;
            case 'NEGATIVE':
                log.setColor(this.config.colors.negative);
                break;
            default:
                log.setColor(this.config.colors.standard);
        }

        if (data.extra) {
            let extra = '';
            Object.entries(data.extra).forEach(entry => {
                extra += `${entry[0]}: ${entry[1]} | `;
            });
            log.setFooter(extra.replace(/\|\s$/, ''));
        }

        const channel: Discord.TextChannel = this.channels.cache.get(
            this.config.ids.channels.logs
        ) as Discord.TextChannel;
        return channel.send(log);
    }

    async loadEvents(): Promise<void> {
        return await fs
            .readdir(__dirname + '/../events/')
            .then(files => {
                files.forEach(async file => {
                    if (!file.endsWith('.js')) return;
                    const event = (await import(__dirname + `/../events/${file}`))
                        .default;
                    let eventName = file.split('.')[0];
                    console.log(`- Attempting to load event ${eventName}`);
                    this.on(eventName, event.bind(this));
                    delete require.cache[
                        require.resolve(__dirname + `/../events/${file}`)
                    ];
                });
            })
            .catch(console.error);
    }

    async loadCommands(): Promise<void> {
        return await fs
            .readdir(__dirname + '/../commands/')
            .then(files => {
                files.forEach(async file => {
                    if (!file.endsWith('.js')) return;
                    let command: Command = (
                        await import(__dirname + '/../commands/' + file)
                    ).default;
                    let commandName = file.split('.')[0];
                    console.log(`- Attempting to load command ${commandName}`);
                    this.commands.set(commandName, command);
                });
            })
            .catch(console.error);
    }

    async accessSpreadsheet(
        sheetID: string,
        credentials: GoogleCredentials
    ): Promise<Google.GoogleSpreadsheetWorksheet[]> {
        const doc = new Google.GoogleSpreadsheet(sheetID);
        await doc.useServiceAccountAuth({
            client_email: credentials.client_email,
            private_key: credentials.private_key
        });
        await doc.loadInfo();
        return doc.sheetsByIndex;
    }

    async cooldownCycle() {
        setInterval(async () => {
            if (new Date().getMinutes() == 45 && new Date().getHours() == 0) {
                let cooldowns = await UpdateCooldown.find();
                if (cooldowns.length) {
                    this.sendLog({
                        user: this.user,
                        title: 'Progress Update Cooldown Reset',
                        description: `Reset the progress update cooldown for the following members:\n\`\`\`${cooldowns
                            .map(cooldown => this.users.cache.get(cooldown.member).tag)
                            .join('\n')}\`\`\``
                    });
                }
                UpdateCooldown.clear();
            }
        }, 60000);
    }
}
