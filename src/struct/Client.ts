import Discord from 'discord.js';
import { Connection, createConnection } from 'typeorm';

export type Log = {
    user: Discord.User;
    title?: any;
    description?: any;
    fields?: Discord.EmbedField[];
    extra?: Record<string, string | number>;
    type?: 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE';
};

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
    google: Record<
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
    ids: {
        roles: Record<string, string>;
        channels: Record<string, string>;
        guild: string;
    };
};

export default class Client extends Discord.Client {
    db: Connection;
    config: Config;

    constructor(config) {
        super({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
        this.config = config;
    }

    async initDatabase(): Promise<void> {
        this.db = await createConnection();
    }

    async sendLog(data: Log): Promise<Discord.Message> {
        const log = new Discord.MessageEmbed({
            title: data.title,
            description: data.description,
            fields: data.fields,
            author: {
                name: data.user.tag,
                icon_url: data.user.displayAvatarURL({ format: 'png', dynamic: true }),
                url: `https://discordapp.com/users/${data.user.id}/`
            }
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
}
