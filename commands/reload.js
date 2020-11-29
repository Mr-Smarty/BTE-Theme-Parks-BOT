exports.run = (client, message, args) => {
    if(!args[0]) return;
    if(args[0].toLowerCase() == 'count' && message.member.roles.cache.has(client.ids.modRoleID)) {
        const memberCount = message.guild.memberCount - 3;
        client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);
        message.channel.send('Member count reloaded. :white_check_mark:')
        return;
    }
    if (message.author.id !== client.config.ownerID) {
        message.channel.send('Only the bot developer can reload commands.');
        return;
    }

    if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");
    const commandName = args[0].toLowerCase();

    if(!client.commands.has(commandName)) {
        return message.reply("That command does not exist");
    }
    
    delete require.cache[require.resolve(`./${commandName}.js`)];
    
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`The command ${commandName} has been reloaded`);
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=reload`",
    description: "**Usage:** `=reload <command name>` OR `=reload count`\n**Description:** Reloads the specified command after an edit without need to restart the bot. Can also reload the member counter. \n**Requirements:** Be the bot developer \\:|"
}};

exports.permLevel = -1;
exports.name = 'reload';