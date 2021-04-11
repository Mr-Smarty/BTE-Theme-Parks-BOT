const Enmap = require('enmap');
const Discord = require('discord.js');

module.exports = class Park extends Object {
    /**
     * Initializes a new park or project with options
     * @param {string} name The name of the park/project
     * @param {object} options The options for the new park.
     * 
     *    `hasReactionRole`: Whether or not the park or project has a reaction role (true if it has a role, false if not).
     * 
     *    `hasChannel`: Whether or not the park or project has a dedicated channel (true if it has a channel, false if not).
     * 
     *    `visibility`: The visibility of the park/channel. Options are `private`, `toRole`, `toAll`. Will be ignored if the park does not have a channel.
     * 
     *    `hidden`: Whether or not the project is hidden. (true if it is, false if not) This only affects its visibility on the project list.
     * 
     *    `emoji`: The emoji used for reaction roles in the form of a unicode emoji or in the format `<:name:id>` for Disord emojis. Required no matter what.
     * 
     * @param {boolean} options.hasReactionRole
     * @param {boolean} options.hasChannel
     * @param {string} options.visibility
     * @param {boolean} options.hidden
     * @param {string} options.emoji
     */

    constructor(name, options) {
        super();
        this._name = name;
        this._hasReactionRole = options.hasReactionRole;
        this._role = undefined;
        this._hasChannel = options.hasChannel;
        this._channel = undefined;
        this._visibility = options.visibility;
        this._hidden = options.hidden;
        this._emoji = options.emoji;
        this._status = undefined;
        this._projects = new Array(1);
        this._init = false;
        this._pinMessage = undefined;
    }

    get name() {
        return this._name;
    }

    /**
     * @param {string} name
     */
    set name(name) {
        this._name = name;
    }

    get status() {
        return this.status;
    }

    /**
     * @param {string} status
     */
    set status(status) {
        this._status = status;
    }

    get role() {
        return this._role;
    }

    get channel() {
        return this._channel;
    }

    get options() {
        return {
            name: this._name,
            hasReactionRole: this._hasReactionRole,
            hasChannel: this._hasChannel,
            visibility: this._visibility,
            hidden: this._hidden,
            emoji: this._emoji
        };
    }

    get pinMessage() {
        return this._pinMessage;
    }

    /**
     * @param {Discord.Message} message
     */
    set pinMessage(message) {
        this._pinMessage = message
    }

    /**
     * @param {string} emoji
     */
    set emoji(emoji) {
        this._emoji = emoji;
    }

    get init() {
        return this._init;
    }

    get projects() {
        return this._projects;
    }

    /**
     * Initiates the park according to its settings
     * @param {Discord.Client} client
     * @returns {Promise<[Discord.Role, Discord.Channel]>} When rejected, returns error. When fulfilled, returns `[role, channel]`.
     */
    init(client) {
        return new Promise((resolve, reject) => {
            if(this._init) return reject('Park is already initialized.');

            let roleOptions = {
                data: {
                    name: this._name,
                    color: 'DEFAULT',
                    hoist: false,
                    position: client.config.projectRoleStartPos,
                    permissions: [
                        'CREATE_INSTANT_INVITE',
                        'ADD_REACTIONS',
                        'VIEW_CHANNEL',
                        'CHANGE_NICKNAME',
                        'SEND_MESSAGES',
                        'USE_EXTERNAL_EMOJIS',
                        'READ_MESSAGE_HISTORY',
                        'CONNECT',
                        'SPEAK',
                        'STREAM',
                        'USE_VAD'
                    ], 
                    mentionable: false
                },
                reason: `New project role for ${this._name}`
            };
            client.guilds.cache.get(client.ids.guildID).roles.create(roleOptions).then(newRole => {
                this._role = newRole;

                if(this._hasChannel) {
                    var visibility;
                    switch(this._visibility) {
                        case "private":
                            visibility = "only chosen members";
                            break;
                        case "toRole":
                            visibility = "those with the project role";
                            break;
                        case "toAll":
                            visibility = "all members";
                            break;
                    }

                    let channelOptions = {
                        type: 'text',
                        topic: `Project channel for ${this._name}. This project has ${this._hasReactionRole ? "an" : "no"} attainable reaction role. It is visible to ${visibility}.`,
                        nsfw: false,
                        parent: client.ids.projectChannelCategory,
                        reason: `New project channel for ${this._name}`
                    };
                    if(this._visibility == 'toAll') channelOptions.position = client.config.projectChannelStartPos;

                    client.guilds.cache.get(client.ids.guildID).channels.create(`${this._visibility == 'toAll' ? '⭐' : '🎢'}${this._name}`, channelOptions).then(async newChannel => {
                        this._channel = newChannel;
                        await (async () => {switch(this._visibility) {
                            case "private":
                                break;
                            case "toRole":
                                await newChannel.updateOverwrite(newRole, {'VIEW_CHANNEL': true})
                                break;
                            case "toAll":
                                await newChannel.updateOverwrite(newChannel.guild.roles.everyone, {'VIEW_CHANNEL': true})
                                break;
                        }})();
                        
                        let embed = {embed: {
                            color: client.info.embedHexcode,
                            title: "Project Information",
                            fields: [
                                {
                                    name: "Status",
                                    value: "Not specified"
                                },
                                {
                                    name: "Sub-projects",
                                    value: "None specified"
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: "Last updated",
                                icon_url: newChannel.guild.iconURL()
                            }
                        }};
                        await newChannel.send(embed).then(msg => msg.pin({reason: "Initialization"})).then(msg => this.pinMessage = msg);
                        this._init = true;
                        return resolve([newRole, newChannel]);
                    }).catch(err => {return reject(err)});
                } else {
                    this._channel = null;
                    this._init = true;
                    return resolve([newRole, null]);
                }
            }).catch(err => {return reject(err)});
        })
    }

    /** 
     * @param {Enmap} enmap
     * @returns {Promise<Enmap>}
     */
    save(enmap) {
        return new Promise((resolve, reject) => {
            try {
                enmap.set(this._name, this);
                return resolve(enmap); 
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Reloads the reaction role menu.
     * @param {Enmap} enmap Park enmap
     * @param {Discord.Client} client Current client intance in use
     * @param {string} extraMessage Extra message at the end of the reaction role menus
     */
    static reloadReactionRoles(enmap, client, extraMessage) {
        return new Promise((resolve, reject) => {
            let parkEmojis = {};
            enmap.forEach((park, parkName) => {
                parkEmojis[parkName] = [park._emoji, park._hasReactionRole];
            });

            let message = "**__Reaction Role Menu__**\nReact below to get your park roles.\n";
            let messages = [''];
            let reactions = [[]];
            let overflow = 0;
            let i = 0;

            for (const key in parkEmojis) {
                if((messages[overflow].length + `\n${parkEmojis[key][0]} : \`${key}\`\n`.length > 2000) || i == 20) {
                    overflow++;
                    i = 0;
                    messages[overflow] = '';
                    reactions[overflow] = [];
                }

                if(parkEmojis[key][1]) {
                    messages[overflow] += `\n${parkEmojis[key][0]} : \`${key}\`\n`;
                    reactions[overflow][i] = parkEmojis[key][0].replace(/<a?:\w{2,}:\d{18}>/g, parkEmojis[key][0].match(/\d{18}/g))
                    i++;
                } else delete parkEmojis[key];
            }
            
            let channel = client.channels.cache.get(client.ids.getRoles);
            channel.messages.fetch({ limit: 27 }).then(messages => messages.each(msg => msg.delete())).catch(err => {return reject(err);});
            
            channel.send(message).catch(err => {return reject(err);});
            messages.forEach((message, index) => {
                channel.send(message).then(msg => {
                    reactions[index].forEach(reaction => {
                        try {
                            msg.react(reaction);
                        } catch (error) {
                            return reject(error);
                        }
                    });
                }).catch(err => {return reject(err);});
            });
            channel.send(extraMessage).then(() => {return resolve();}).catch(err => {return reject(err);});
        });
    }

    /**
     * Reloads the reaction role menu.
     * @param {Enmap} enmap Park enmap
     * @param {Discord.Client} client Current client intance in use
     * @param {string} extraMessage Extra message at the end of the list
     */
    static reloadProjectList(enmap, client, extraMessage) {
        return new Promise((resolve, reject) => {
            let message = '**__Project List:__**';
            let messages = [''];
            let overflow = 0;

            enmap.forEach((park, parkName) => {
                if(!park._hidden) {
                    let str = `​\n**${parkName}** `;
                    park._hasChannel ? str += enmap.get(parkName).channel.toString() : str += '(no channel)';
                    switch(park._visibility) {
                        case 'private':
                            str += ' (private)\n'
                            break;
                        case 'toRole':
                            str += ' (visible to project role)\n';
                            break;
                        case 'toAll':
                            str += ' (visible to all)\n';
                            break;
                    }

                    if(messages[overflow].length + str.length > 2000) {
                        overflow++;
                        messages[overflow] = '';
                    }

                    messages[overflow] += str;
                }
            });

            let channel = client.channels.cache.get(client.ids.projectList);
            channel.messages.fetch({ limit: 27 }).then(messages => messages.each(msg => msg.delete())).catch(err => {return reject(err);});

            channel.send(message).catch(err => {return reject(err);});
            messages.forEach(message => {
                channel.send(message).catch(err => {return reject(err);});
            });
            channel.send(extraMessage).then(() => {return resolve();}).catch(err => {return reject(err);});
        });
    }
} 


// if(enmap.some(park => {return park._name.toLowerCase() == this._name.toLowerCase();})) return reject('A park with this name already exists.');
//check for repeating names, emojis