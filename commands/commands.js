exports.run = (client, message, args) => {
    if (message.author.id == client.config.ownerID) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `DEV`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=req** \n **=commands** \n **=modSay** \n **=devCommand** (TEST) \n **=modCommand** (TEST)')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.adminRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `ADMIN`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=req** \n **=commands** \n **=modSay** \n **=adminCommand** (TEST) \n **=modCommand** (TEST)')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (message.member.roles.cache.has(client.ids.modRoleID) || message.member.roles.cache.has(client.ids.trialModRoleID)) {
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `MOD | TRIAL MOD`")
        .setColor(client.info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=req** \n **=commands** \n **=modSay** \n **=modCommand** (TEST)')
        .setTimestamp(client.info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } 
    const commandEmbed = new client.Discord.MessageEmbed()
    .setTitle("Available Commands")
    .setColor(client.info.embedHexcode)
    .setDescription('**=ping** \n **=server** \n > **=players** \n **=req** \n **=commands**')
    .setTimestamp(client.info.commandUpdate)
    .setFooter("Last updated by MrSmarty#1732", client.info.devIconLink)
    message.channel.send(commandEmbed);
}