import Discord from 'discord.js';
import { Connection, createConnection } from 'typeorm';
import Command from './Command';
import fs from 'fs/promises';
import Google from 'google-spreadsheet';

export type Log = {
    user: Discord.User;
    title?: any;
    description?: any;
    fields?: Discord.EmbedField[];
    extra?: Record<string, string | number>;
    type?: 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE';
};

export type GoogleCredentials = Record<
    | 'type'
    | 'project_id'
    | 'private_key_id'
    | 'private_key'
    | 'client_email'
    | 'client_id'
    | 'auth_uri'
    | 'auth_provider_x509_cert_url'
    | 'client_x509_cert_url',
    string
>;

export type Config = {
    token: string;
    prefix: string;
    ownerID: string;
    iconURL: string;
    projectRoleStartPos: number;
    projectChannelStartPos: number;
    apiKey: string;
    collabApikeys: Record<string, string>;
    server: { IP: string; port: number };
    colors: Record<'standard' | 'positive' | 'negative', string>;
    database: Record<'host' | 'port' | 'username' | 'password' | 'name', string>;
    google: GoogleCredentials;
    builderGoogleSheetsID: string;
    ids: {
        roles: Record<string, string>;
        channels: Record<string, string>;
        guild: string;
    };
};

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
}
