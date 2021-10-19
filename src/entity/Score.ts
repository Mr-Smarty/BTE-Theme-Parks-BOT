import { GuildMember, MessageEmbed, User } from 'discord.js';
import intersect from '../util/intersect';
import { BaseEntity, Entity, Column } from 'typeorm';
import Client from '../struct/Client';
import SnowflakePrimaryColumn from './decorators/SnowflakePrimaryColumn';

@Entity()
export class Score extends BaseEntity {
    @SnowflakePrimaryColumn()
    id: string;

    @Column()
    score: number;

    static embed(
        client: Client,
        { scoreEntity, user, value }: { scoreEntity?: Score; user?: User; value?: number }
    ) {
        if (!user) user = client.guild.members.cache.get(scoreEntity.id).user;
        return new MessageEmbed({
            author: {
                name: user.username,
                iconURL: user.displayAvatarURL({ format: 'png', dynamic: true })
            },
            description: `Score for <@!${user.id}>: \`${
                value !== undefined ? value : scoreEntity.score
            }\``,
            timestamp: new Date(),
            color: client.config.colors.standard
        });
    }

    static async clearGarbage(): Promise<Score[]> {
        return this.remove(await this.find({ score: 0 }));
    }

    async checkLevel(client: Client, member: GuildMember): Promise<void> {
        let reward = client.config.builderRewards.find(
            reward => reward.value == this.score
        );
        if (!reward) return;

        await Promise.all(
            reward.roles.map(role => member.roles.add(client.guild.roles.cache.get(role)))
        );
        await member.user.send(reward.message).catch(() => {});
    }

    async checkLevelThorough(client: Client, member: GuildMember): Promise<void> {
        let curRoles = intersect(
            member.roles.cache.map(role => role.id),
            client.config.builderRewards.flatMap(reward => reward.roles)
        );

        let rewardsNotGiven = client.config.builderRewards.filter(
            reward => !curRoles.includes(reward.roles[0])
        );

        let rewardsGiven = client.config.builderRewards.filter(reward =>
            curRoles.includes(reward.roles[0])
        );

        await Promise.all(
            rewardsNotGiven.flatMap(reward => {
                if (this.score >= reward.value) {
                    member.user.send(reward.message).catch(() => {});
                    return reward.roles.map(role => member.roles.add(role));
                } else return Promise.resolve(member);
            })
        );

        await Promise.all(
            rewardsGiven.flatMap(reward => {
                this.score < reward.value
                    ? reward.roles.map(role => member.roles.remove(role))
                    : Promise.resolve();
            })
        );
    }
}
