import Discord from 'discord.js';

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
    ownerId: string;
    iconURL: string;
    env?: 'production';
    projectRoleStartPos: number;
    projectChannelStartPos: number;
    apiKey: string;
    collabApikeys: Record<string, string>;
    server: { IP: string; port: number; network: { java: string; bedrock: string } };
    colors: Record<'standard' | 'positive' | 'negative', Discord.ColorResolvable>;
    database: Record<'host' | 'port' | 'username' | 'password' | 'name', string>;
    google: GoogleCredentials;
    builderGoogleSheetsId: string;
    ids: {
        roles: Record<string, string>;
        channels: Record<string, string>;
        emojis: Record<string, string>;
        guild: string;
    };
    builderRewards: { value: number; roles: string[]; message: string }[];
};

export interface CommandProperties {
    name: string;
    aliases: string[];
    permission: string[] | ['any'] | ['dev'];
    description: string;
    usage: string | string[] | null;
    dms?: boolean;
    channels?: string[] | false;
    run: (client: Discord.Client, message: Discord.Message, args: string[]) => void;
}
