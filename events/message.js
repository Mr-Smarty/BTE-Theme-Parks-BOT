module.exports = (client, message) => {
    if (message.author.bot) return;

    if (message.channel.id !== '715017068772196424') {
        if (!message.content.startsWith(client.prefix)) return;
    };

    if (message.channel.id === '715017068772196424') {
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