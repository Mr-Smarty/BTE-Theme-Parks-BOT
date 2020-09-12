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
    console.log(userMessage + '\n' + channel);
    channel.send(userMessage);
    message.react('✅');
};