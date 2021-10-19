import { Message } from 'discord.js';
import { Score } from '../entity/Score';
import { UpdateCooldown } from '../entity/UpdateCooldown';
import Client from '../struct/Client';
import Command from '../struct/Command';

export default new Command({
    name: 'score',
    aliases: ['points'],
    description: "Show and manage builders' scores in the building rewards system",
    permission: ['any'],
    usage: [
        '[user]',
        "<'give'> <user ID> <point amount>",
        "<'delete' | 'reset'> <user ID>"
    ],
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        switch (args[0]?.toLowerCase()) {
            case 'give':
                if (
                    !_client.hasRole(message.author, [
                        _client.config.ids.roles.moderator,
                        _client.config.ids.roles.trialModerator
                    ])
                )
                    return _client.noPerms(
                        [
                            _client.config.ids.roles.moderator,
                            _client.config.ids.roles.trialModerator
                        ],
                        message.channel
                    );

                let user = _client.guild.members.cache.get(args[1])?.user;
                let value = parseInt(args[2]);
                if (!user)
                    return message.channel.send(
                        'Please give a valid user ID and a number.'
                    );
                if (isNaN(value) || value < -10 || value > 10)
                    return message.channel.send('Please give a number from -10 to 10.');

                return _client.db.manager
                    .findOneOrFail(Score, user.id)
                    .then(async score => {
                        if (score.score + value < 0)
                            return message.channel.send(
                                `A user cannot have less than 0 points. They current have \`${score.score}\` points.`
                            );

                        score.score += value;
                        await score.save();
                        await score
                            .checkLevelThorough(
                                _client,
                                _client.guild.members.cache.get(args[1])
                            )
                            .catch(err => {
                                _client.sendLog({
                                    user: _client.user,
                                    title: 'Unhandled Promise Rejection',
                                    description: `\`\`\`\n${err.stack}\n\`\`\``,
                                    type: 'NEGATIVE'
                                });
                            });
                        return message.channel.send({
                            embeds: [
                                {
                                    description: `<@!${user.id}> now has \`${score.score}\` points.`,
                                    color: _client.config.colors.standard
                                }
                            ]
                        });
                    })
                    .catch(async () => {
                        if (value < 0)
                            return message.channel.send(
                                `A user cannot have less than 0 points. They current have \`0\` points.`
                            );

                        let score = new Score();
                        score.id = user.id;
                        score.score = value;
                        await score.save();
                        await score.checkLevelThorough(
                            _client,
                            _client.guild.members.cache.get(args[1])
                        );
                        return message.channel.send({
                            embeds: [
                                {
                                    description: `<@!${user.id}> now has \`${score.score}\` points.`,
                                    color: _client.config.colors.standard
                                }
                            ]
                        });
                    });

            case 'delete': {
                if (!_client.hasRole(message.author, _client.config.ids.roles.admin))
                    return _client.noPerms(
                        [_client.config.ids.roles.admin],
                        message.channel
                    );

                let user = _client.guild.members.cache.get(args[1])?.user;
                if (!user) return message.channel.send('Please give a valid user ID.');

                return _client.db.manager
                    .findOneOrFail(Score, user.id)
                    .then(score => {
                        score.remove();
                        message.react('✅');
                    })
                    .catch(() =>
                        message.channel.send('There was no data for this user to delete!')
                    );
            }

            case 'reset': {
                if (
                    !_client.hasRole(message.author, [
                        _client.config.ids.roles.moderator,
                        _client.config.ids.roles.trialModerator
                    ])
                )
                    return _client.noPerms(
                        [
                            _client.config.ids.roles.moderator,
                            _client.config.ids.roles.trialModerator
                        ],
                        message.channel
                    );

                let user = _client.guild.members.cache.get(args[1])?.user;
                if (!user) return message.channel.send('Please give a valid user ID.');

                return _client.db.manager
                    .findOne(UpdateCooldown, user.id)
                    .then(cooldown => {
                        cooldown?.remove();
                        message.react('✅');
                    });
            }

            default: {
                let user = _client.guild.members.cache.get(args[0])?.user;
                return _client.db.manager
                    .findOneOrFail(Score, user?.id || message.author.id)
                    .then(score =>
                        message.channel.send({
                            embeds: [Score.embed(_client, { scoreEntity: score })]
                        })
                    )
                    .catch(() =>
                        message.channel.send({
                            embeds: [
                                Score.embed(_client, {
                                    user: user || message.author,
                                    value: 0
                                })
                            ]
                        })
                    );
            }
        }
    }
});
