import { Message } from 'discord.js';
import emojiRegex from 'emoji-regex';
import { Project, Visibility } from '../entity/Project';
import Client from '../struct/Client';
import Command from '../struct/Command';

let extraMessage =
    '**In order to actually build in these parks, you need to have the __Builder__ role in this discord server. If you are a Builder and would like to build in the __Universal Orlando Resort__ or __Disneyland Resort__, you can find more information by viewing their respective channels.**\nClick a reaction once to add a role and again to remove it.';
let extraMessage2 =
    '​\nIf you would like to build in any of these existing projects, you are more than welcome to - many of them are still under construction! Please ask a member of our staff team for details.\n**Most parks have their own park-specific channels - if you would like to view the channel for your park, click the reactions in <#717832342550610113>.**';

export default new Command({
    name: 'project',
    aliases: ['projects', 'park', 'burden', 'parks', 'burdens'],
    description: 'Manage team projects',
    permission: ['any'],
    usage: [
        "<'add'> <name> | <(has reaction role) 'true' | 'false'> | <(has channel) 'true' | 'false'> | <(channel visibility) 'role' | 'all' | 'private'> | <(hidden on project list) 'true' | 'false'> | <emoji>",
        "<'delete'> <name> ['| doNotArchive']"
    ],
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        switch (args[0]?.toLowerCase()) {
            case 'add': {
                args.shift();
                let start = new Date();
                let options: Record<string, any> = {};

                if (!_client.hasRole(message.author, _client.config.ids.roles.admin))
                    return _client.noPerms(
                        [_client.config.ids.roles.admin],
                        message.channel
                    );

                args = args.join(' ').split(/ +\| +/g);
                if (args.length !== 6)
                    return message.channel.send(
                        `This command takes 6 arguments seperated by \` | \`! Use \`${_client.config.prefix}commands project\` for more info.`
                    );

                args[0] = args[0].replace(emojiRegex(), '');
                if (args[0].length < 2 || args[0].length > 31)
                    return message.channel.send(
                        'The project name must be between 2 and 31 characters inclusive. Emojis will be removed.'
                    );
                else options.name = args[0];

                if (
                    await _client.db.manager
                        .createQueryBuilder(Project, 'project')
                        .where('LOWER(project.name) = LOWER(:name)', {
                            name: options.name
                        })
                        .withDeleted()
                        .getOne()
                )
                    return message.channel.send(
                        'This project already exists! It may be archived.'
                    );
                if ((await _client.db.manager.count(Project)) > 500)
                    return message.channel.send(
                        'The max limit of 500 projects has been reached.'
                    );

                if (args[1].toLowerCase() == 'true' || args[1].toLowerCase() == 'false') {
                    args[1].toLowerCase() == 'true'
                        ? (options.hasReactionRole = true)
                        : (options.hasReactionRole = false);
                } else
                    return message.channel.send(
                        'The second argument for whether or not the project has a reaction role must be `true` or `false`.'
                    );

                if (args[2].toLowerCase() == 'true' || args[2].toLowerCase() == 'false') {
                    args[2].toLowerCase() == 'true'
                        ? (options.hasChannel = true)
                        : (options.hasChannel = false);
                } else
                    return message.channel.send(
                        'The third argument for whether or not the project has a Discord channel must be `true` or `false`.'
                    );

                switch (args[3].toLowerCase()) {
                    case 'role':
                        options.visibility = Visibility.ROLE;
                        break;
                    case 'all':
                        options.visibility = Visibility.ALL;
                        break;
                    case 'private':
                        options.visibility = Visibility.PRIVATE;
                        break;
                    default:
                        return message.channel.send(
                            'The fourth argument for channel visibility must be given no matter what. Its options are `role`, `all`, or `private`.'
                        );
                }

                if (args[4].toLowerCase() == 'true' || args[4].toLowerCase() == 'false') {
                    args[4].toLowerCase() == 'true'
                        ? (options.hidden = true)
                        : (options.hidden = false);
                } else
                    return message.channel.send(
                        'The fifth argument for whether or not the project is hidden on the project list must be `true` or `false`.'
                    );

                if (
                    emojiRegex().test(args[5]) ||
                    /^<a?:\w{2,}:\d{18,19}>$/g.test(args[5])
                ) {
                    if (emojiRegex().test(args[5])) options.emoji = args[5];
                    else if (
                        _client.guild.emojis.cache.has(args[5].match(/\d{18,19}/g)[0]) &&
                        _client.guild.emojis.cache.get(args[5].match(/\d{18,19}/g)[0])
                            ?.available
                    ) {
                        options.emoji = args[5];
                    } else
                        return message.channel.send(
                            'This emoji is either not accesible or not available.'
                        );
                } else
                    return message.channel.send(
                        'Please give a valid emoji for the fifth argument. If it is a custom emoji, it must be from the BTE Theme Parks Discord server.'
                    );
                if (await _client.db.manager.findOne(Project, { emoji: options.emoji }))
                    return message.channel.send(
                        'A project with this emoji already exists!'
                    );

                let proj = new Project();
                proj.name = options.name;
                proj.hasReactionRole = options.hasReactionRole;
                proj.hasChannel = options.hasChannel;
                proj.visibility = options.visibility;
                proj.hidden = options.hidden;
                proj.emoji = options.emoji;
                await proj.init(_client);
                await proj.save();
                await Promise.all([
                    Project.reloadReactionRoles(_client, extraMessage),
                    Project.reloadProjectList(_client, extraMessage2)
                ]);
                message.react('✅');
                _client.sendLog({
                    user: message.author,
                    title: `A new project "${proj.name}" has been created.`,
                    description: `**${_client.anyMessageMember(
                        message
                    )} has created the project \`${
                        proj.name
                    }\` with the following properties:**\nReaction Role?: \`${
                        proj.hasReactionRole
                    }\`\n${
                        proj.hasChannel
                            ? `Channel: <#${proj.channel}>`
                            : 'Channel?: `false`'
                    }\nVisibility: \`${args[3].toLowerCase()}\`\nProject List Hidden?: \`${
                        proj.hidden
                    }\`\nEmoji: ${proj.emoji}`,
                    extra: {
                        'Processing Time': `${new Date().getTime() - start.getTime()}ms`
                    },
                    type: 'POSITIVE'
                });
                break;
            }

            case 'delete': {
                args.shift();
                args = args.join(' ').split(/ +\| +/g);

                if (!args[0])
                    return message.channel.send('Please provide a project name!');
                let archive = args[1]?.toLowerCase() !== 'donotarchive';

                let project = await _client.db.manager
                    .createQueryBuilder(Project, 'project')
                    .where('LOWER(project.name) = LOWER(:name)', {
                        name: args[0]
                    })
                    .getOne();
                if (!project) return message.channel.send('That project does not exist!');

                await message.channel.send(
                    `Are you sure you would like to delete the project \`${
                        project.name
                    }\`${
                        archive ? '' : ' and delete all of its data permanently'
                    }? Type \`yes\` to confirm or \`no\` to cancel.`
                );
                const filter = m =>
                    m.author.id == message.author.id &&
                    (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
                await message.channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 16000,
                        errors: ['time']
                    })
                    .then(async response => {
                        let start = new Date();
                        switch (response.first().content.toLowerCase()) {
                            case 'yes': {
                                let name = project.name;

                                project.getRole(_client).delete('Deleting project role');
                                project.role = null;

                                if (archive) {
                                    project
                                        .getChannel(_client)
                                        ?.setParent(
                                            _client.config.ids.channels.archivedProjects
                                        );
                                    await project.softRemove();
                                } else {
                                    project.getChannel(_client)?.delete();
                                    await project.remove();
                                }

                                await Promise.all([
                                    Project.reloadReactionRoles(_client, extraMessage),
                                    Project.reloadProjectList(_client, extraMessage2)
                                ]);
                                message.react('✅');
                                return _client.sendLog({
                                    user: message.author,
                                    title: `The project \`${name}\` has been deleted.`,
                                    description: `${_client.anyMessageMember(
                                        message
                                    )} has deleted the project \`${name}\` and the data has ${
                                        archive ? 'been archived' : 'been deleted'
                                    }.`,
                                    extra: {
                                        'Processing Time': `${
                                            new Date().getTime() - start.getTime()
                                        }ms`
                                    },
                                    type: 'NEGATIVE'
                                });
                            }
                            case 'no': {
                                return message.channel.send('Operation cancelled.');
                            }
                        }
                    })
                    .catch(() => {
                        message.channel.send('Operation cancelled: timed out');
                    });
            }
        }
    }
});
