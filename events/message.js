module.exports = (client, message) => {
    if(message.webhookID && message.channel.id === '739239527431798805') return client.autoApp.run(client, message);
    if (message.author.bot) return;

    if (message.channel.id !== '715017068772196424') {
        if (!message.content.startsWith(client.prefix)) return;
    };

    if (message.channel.id === '715017068772196424') {
        if (!message.content.startsWith('#')) {
            return message.delete().then(() => message.channel.send('Please Number your suggestion in the format `#number suggestion content`.').then(msg => {msg.delete({ timeout: 7500 })}))
        }
        message.react('730466277390417930')
        .then(() => message.react('🤷‍♂️'))
        .then(() => message.react('730466352430579813'))
        .catch(() => console.error('One of the emojis failed to react.'));
        return;
    }

    if (message.channel.name == undefined) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return;

    cmd.run(client, message, args);
};