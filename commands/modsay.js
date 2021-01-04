exports.run = (client, message, args) => {
    if (!message.member.roles.cache.has(client.ids.modRoleID) && !message.member.roles.cache.has(client.ids.trialModRoleID)) return;
    if (message.channel.parent.id !== ('718967444294860873' || '704382526902501376')) return message.channel.send(':eyes:')    

    if (!message.mentions.channels.first()) {
        message.channel.send('Please mention a channel.');
        return;
    }
    let channel = message.mentions.channels.first();
    let userMessage = args.slice(1).join(" ");
    if (!userMessage) {
        message.channel.send('Please enter a message');
        return;
    }
    channel.send(userMessage);
    message.react('✅');
    client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) used the command \`=modSay\` to **<#${channel.id}>** with the following message:**\n${userMessage}`, null, {"Sender ID": message.author.id});
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=modSay`",
    description:"**Usage:** `=modSay <Channel Mention> <Message>`\n**Description:** Sends a the specified message in the specified channel. Confirmed by reaction with :white_check_mark:  \n**Requirements:** Moderator OR Trial Moderator, \"MODERATION\" OR \"ADMIN\" channel category"
}};

exports.noHelp = {embed: {
    color: "#60b0f4",
    title: "Commands: `=modSay`",
    description: "This command's information is a secret :eyes: Please get this command's information in either the \"MODERATION\" or \"ADMIN\" channel categories."
}};

exports.permLevel = 3;
exports.name = 'modsay';