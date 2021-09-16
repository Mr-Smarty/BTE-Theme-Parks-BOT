import { BaseEntity, Entity } from 'typeorm';
import SnowflakePrimaryColumn from './decorators/SnowflakePrimaryColumn';
import SnowflakeColumn from './decorators/SnowflakeColumn';
import Discord from 'discord.js';

@Entity()
export class ClientInfo extends BaseEntity {
    @SnowflakePrimaryColumn()
    id: string;

    @SnowflakeColumn()
    lastChannel: string;

    @SnowflakeColumn()
    lastMessage: string;

    async restart(client: Discord.Client): Promise<Discord.Message> {
        const channel = (await client.channels.fetch(
            this.lastChannel
        )) as Discord.TextChannel;
        const message = await channel.messages.fetch(this.lastMessage);
        return message.edit('Bot restarted! :white_check_mark:');
    }
}
