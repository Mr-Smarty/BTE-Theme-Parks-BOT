import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    DeleteDateColumn
} from 'typeorm';
import SnowflakeColumn from './decorators/SnowflakeColumn';
import emoji from './transformers/emoji';
import { SubProject } from './SubProject';
import Discord from 'discord.js';
import Client from '../struct/client';

export enum Visibility {
    ALL = 0,
    ROLE,
    PRIVATE
}

export enum Status {
    NO_PROGRESS = 1,
    SOME_PROGRESS = 2,
    MUCH_PROGRESS = 3,
    COMPLETE = 0,
    ABANDONED = -1
}

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 31 })
    name: string;

    @Column({ name: 'has_reaction_role', default: true })
    hasReactionRole: boolean = true;

    @SnowflakeColumn({ nullable: true })
    role?: string;

    @Column({ name: 'has_channel', default: true })
    hasChannel: boolean = true;

    @SnowflakeColumn({ nullable: true })
    channel?: string;

    @Column({ type: 'enum', enum: Visibility, default: Visibility.ROLE })
    visibility: Visibility = Visibility.ROLE;

    @Column({ default: false })
    hidden: boolean = false;

    @Column({ transformer: emoji })
    emoji: string;

    @Column({ type: 'enum', enum: Status, default: Status.NO_PROGRESS })
    status: string;

    @Column({ default: false, name: 'is_init' })
    isInit: boolean;

    @SnowflakeColumn({ name: 'pin_message', nullable: true })
    pinMessage?: string;

    @OneToMany(() => SubProject, subProject => subProject.parentProject, {
        cascade: true
    })
    subProjects: SubProject[];

    @DeleteDateColumn()
    dateArchived: Date;

    static async reloadReactionRoles(client: Client, message: string): Promise<void> {
        let msg = '**__Reaction Role Menu__**\nReact below to get your park roles.\n';

        let parkEmojis: Record<string, string> = {};
        let reactionRoleProjects = await this.find({
            where: { hasReactionRole: true },
            order: { role: 'ASC' }
        });
        reactionRoleProjects.forEach(
            project => (parkEmojis[project.name] = project.emoji)
        );

        let messages = [''];
        let reactions = [[]];
        let overflow = 0;
        let curReactionCount = 0;
        for (const key in parkEmojis) {
            if (
                messages[overflow].length +
                    `\n${parkEmojis[key][0]} : \`${key}\`\n`.length >
                    2000 ||
                curReactionCount == 20
            ) {
                overflow++;
                curReactionCount = 0;
                messages[overflow] = '';
                reactions[overflow] = [];
            }
            messages[overflow] += `\n${parkEmojis[key]} : \`${key}\`\n`;
            reactions[overflow][curReactionCount] = parkEmojis[key].replace(
                /<a?:\w{2,}:\d{18}>/,
                parkEmojis[key].match(/\d{18}/g)?.[0] || ''
            );
            curReactionCount++;
        }

        let channel = client.channels.cache.get(
            client.config.ids.channels.getRoles
        ) as Discord.TextChannel;
        let oldMessages = await channel.messages.fetch({ limit: 27 });
        oldMessages.forEach(message => message.delete());
        channel.send(msg);
        messages.forEach(async (message, index) => {
            let msg = await channel.send(message);
            reactions[index].forEach(reaction => {
                msg.react(reaction);
            });
        });
        await channel.send(message);
    }

    static async reloadProjectList(client: Client, message: string): Promise<void> {
        let msg = '**__Project List:__**';
        let messages = [''];
        let overflow = 0;

        let projectListProjects = await this.find({
            where: { hidden: false },
            order: { role: 'ASC' }
        });
        projectListProjects.forEach(project => {
            let str = `​\n**${project.name}** `;
            if (project.hasChannel) {
                str += project.getChannel(client).toString();

                switch (project.visibility) {
                    case Visibility.PRIVATE:
                        str += ' (private)\n';
                        break;
                    case Visibility.ROLE:
                        str += ' (visible to project role)\n';
                        break;
                    case Visibility.ALL:
                        str += ' (visible to all)\n';
                        break;
                }
            } else str += '(no channel)\n';

            if (messages[overflow].length + str.length > 2000) {
                overflow++;
                messages[overflow] = '';
            }

            messages[overflow] += str;
        });

        let channel = client.channels.cache.get(
            client.config.ids.channels.projectList
        ) as Discord.TextChannel;
        let oldMessages = await channel.messages.fetch({ limit: 27 });
        oldMessages.forEach(message => message.delete());
        await channel.send(msg);
        messages.forEach(async message => {
            await channel.send(message);
        });
        await channel.send(message);
    }

    async init(
        client: Client
    ): Promise<{ role: Discord.Role; channel?: Discord.Channel }> {
        return new Promise(async (resolve, reject) => {
            if (this.isInit) return reject('Project is already initialized');

            let roleOptions: Discord.CreateRoleOptions = {
                name: this.name,
                color: 'DEFAULT',
                position: client.config.projectRoleStartPos,
                mentionable: false,
                reason: `New project role for ${this.name}`
            };

            let role = await client.guild.roles.create(roleOptions);
            this.role = role.id;

            if (this.hasChannel) {
                let visibility: string;
                switch (this.visibility) {
                    case Visibility.PRIVATE:
                        visibility = 'only chosen members';
                        break;
                    case Visibility.ROLE:
                        visibility = 'those with the project role';
                        break;
                    case Visibility.ALL:
                        visibility = 'all members';
                        break;
                }

                let channelOptions: Discord.GuildChannelCreateOptions = {
                    type: 'GUILD_TEXT',
                    topic: `Project channel for ${this.name}. This project has ${
                        this.hasReactionRole ? 'an' : 'no'
                    } attainable reaction role. It is visible to ${visibility}.`,
                    parent: client.config.ids.channels.projectChat,
                    reason: `New project channel for ${this.name}`
                };
                if (this.visibility == Visibility.ALL)
                    channelOptions.position = client.config.projectChannelStartPos;

                let channel = (await client.guild.channels.create(
                    `${this.visibility == Visibility.ALL ? '⭐' : '🎢'}${this.name}`,
                    channelOptions
                )) as Discord.TextChannel;
                this.channel = channel.id;

                switch (this.visibility) {
                    case Visibility.ROLE:
                        await channel.permissionOverwrites.edit(role, {
                            VIEW_CHANNEL: true
                        });
                        break;
                    case Visibility.ALL:
                        await channel.permissionOverwrites.edit(
                            client.guild.roles.everyone,
                            { VIEW_CHANNEL: true }
                        );
                        break;
                }

                let message = await channel.send({
                    embeds: [
                        {
                            color: client.config.colors.standard,
                            title: 'Project Information',
                            fields: [
                                {
                                    name: 'Status',
                                    value: 'Not specified'
                                },
                                {
                                    name: 'Sub-projects',
                                    value: 'None specified'
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: 'Last updated',
                                icon_url: client.guild.iconURL()
                            }
                        }
                    ]
                });
                message.pin();
                this.pinMessage = message.id;

                this.isInit = true;
                return resolve({ role: role, channel: channel });
            }

            this.isInit = true;
            return resolve({ role: role });
        });
    }

    getRole(client: Client): Discord.Role {
        return client.guild.roles.cache.get(this.role);
    }

    getChannel(client: Client): Discord.TextChannel {
        return client.channels.cache.get(this.channel) as Discord.TextChannel;
    }

    async getPinMessage(client: Client): Promise<Discord.Message> {
        return this.getChannel(client)?.messages.fetch(this.pinMessage);
    }
}
