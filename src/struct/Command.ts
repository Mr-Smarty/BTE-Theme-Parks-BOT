import Discord from 'discord.js';
import Client from './Client';

export default class Command implements CommandProperties {
    name: string;
    aliases: string[];
    description: string;
    permission: string | string[];
    usage: string | string[];
    dms: boolean;
    channels: string[] | false;
    run: (
        client: Client,
        message: Discord.Message,
        args: string[]
    ) => void | Promise<void>;

    constructor(properties: CommandProperties) {
        this.name = properties.name;
        this.aliases = properties.aliases;
        this.description = properties.description;
        this.permission = properties.permission;
        this.usage = properties.usage;
        this.dms = properties.dms || false;
        this.channels = properties.channels || false;
        this.run = properties.run.bind(this);
    }
}

export interface CommandProperties {
    name: string;
    aliases: string[];
    permission: string | string[];
    description: string;
    usage: string | string[];
    dms?: boolean;
    channels?: string[] | false;
    run: (client: Client, message: Discord.Message, args: string[]) => void;
}
