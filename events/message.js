module.exports = (client, message) => {
    //=========Check Applications, ignore bots=========//
    if(message.webhookID && message.channel.id === client.ids.builderApplications) return client.autoApp.run(client, message);
    if(message.author.bot) return;
    
    //=========Progress Update Cooldown=========//
    if(message.channel.id == client.ids.progressUpdates) {
        client.updateCooldowns.ensure(`${message.author.id}`, false)
        if(client.updateCooldowns.get(`${message.author.id}`)) {
            let now = new Date()
            let waitTime = `${20 - now.getHours()} hours, ${60 - now.getMinutes()} minutes`
            message.delete().then(() => message.channel.send(`You have already posted a progress update today. Please wait ${waitTime} before posting another update.`).then(msg => {msg.delete({ timeout: 10000 })}));
            return;
        }
        client.updateCooldowns.set(`${message.author.id}`, true)
    }

    //=========Verify and react to suggestions=========//
    if(message.channel.id === client.ids.suggestions) {
        if(!message.content.startsWith('#')) {
            return message.delete().then(() => message.channel.send('Please Number your suggestion in the format `#number suggestion content`.').then(msg => {msg.delete({ timeout: 7500 })}))
        }
        message.react('730466277390417930')
        .then(() => message.react('🤷‍♂️'))
        .then(() => message.react('730466352430579813'))
        .catch(() => console.error('One of the emojis failed to react.'));
        return;
    }

    //=========Ignore of message does not start with prefix=========//
    if(!message.content.startsWith(client.prefix)) return;

    //=========Ignore DM's=========//
    if(message.channel.name == undefined) return;

    //=========Get command and arguments=========//
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //=========Checks if command has response=========//
    if(client.responses.has(command)) return client.responses.get(command, 'isEmbed') ? message.channel.send({embed: client.responses.get(command, 'response')}).catch(err => console.log("Error sending embed:\n" + err)) : message.channel.send(client.responses.get(command, 'response'));

    //=========Run command=========//
    const cmd = client.commands.get(command);

    if (!cmd) return;

    cmd.run(client, message, args);
};