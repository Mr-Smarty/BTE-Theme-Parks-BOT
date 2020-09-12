exports.run = (client, message, args) => {
    if (args.length !== 0) {
        if (!client.commands.has(args[0])) {
            message.channel.send(`The command \`=${args[0]}\` doesnt exist!`);
            return;
        }
        message.channel.send(`Placeholder info for the command \`=${args[0]}\``);
    } else
    if (message.author.id == client.config.ownerID) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `DEV`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=score** \n **=commands** \n **=modSay** \n **=devCommand** (TEST) \n **=modCommand** (TEST) \n **=reload** \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.adminRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `ADMIN`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=score** \n **=commands** \n **=modSay** \n **=adminCommand** (TEST) \n **=modCommand** (TEST) \n **=reactions** \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.modRoleID) || message.member.roles.cache.has(client.ids.trialModRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `MOD | TRIAL MOD`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=score** \n **=commands** \n **=modSay** \n **=modCommand** (TEST) \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=score** \n **=commands**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
    }
};