exports.run = (client, message, args) => {
    if (args.length !== 0) {
        if (!client.commands.has(args[0].toLowerCase())) {
            message.channel.send(`The command \`=${args[0]}\` doesnt exist!`);
            return;
        }
        if (args[0].toLowerCase() === 'modsay' && message.channel.parent.id !== ('718967444294860873' || '704382526902501376')) return message.channel.send({ embed: client.commandEmbeds.nomodsay })
        message.channel.send({ embed: client.commandEmbeds[args[0].toLowerCase()] });
    } else
    if (message.author.id == client.config.ownerID) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `DEV`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=help** \n**=ping** \n **=commands** \n **=server** \n **=players** \n **=score** \n **=modSay** \n **=devCommand** (TEST) \n **=modCommand** (TEST) \n **=reload** \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.adminRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `ADMIN`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=help** \n**=ping** \n **=commands** \n **=server** \n **=players** \n **=score** \n **=modSay** \n **=adminCommand** (TEST) \n **=modCommand** (TEST) \n **=reactions** \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.modRoleID) || message.member.roles.cache.has(client.ids.trialModRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `MOD | TRIAL MOD`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=help** \n**=ping** \n **=commands** \n **=server** \n **=players** \n **=score** \n **=modSay** \n **=modCommand** (TEST) \n **=app**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
        return;
    } else {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands")
        .setColor(client.info.embedHexcode)
        .setDescription('**=help** \n**=ping** \n **=commands** \n **=server** \n **=players** \n **=score**')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink);
        message.channel.send(commandEmbed);
    }
};