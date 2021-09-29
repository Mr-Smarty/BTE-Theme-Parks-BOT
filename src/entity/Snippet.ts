import { MessageEmbedOptions, MessageOptions } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import Client from '../struct/client';

@Entity()
export class Snippet extends BaseEntity {
    @PrimaryColumn({ length: 32 })
    id: string;

    @Column()
    name: string;

    @Column()
    embed: boolean;

    @Column({ nullable: true })
    textContent: string;

    @Column({ type: 'simple-json', nullable: true })
    embedContent: MessageEmbedOptions;

    display(client: Client): MessageOptions {
        if (this.embed) {
            let copy = JSON.parse(JSON.stringify(this.embedContent));
            copy.color = client.config.colors.standard;
            return { embeds: [copy] };
        } else return { content: this.textContent };
    }
}
