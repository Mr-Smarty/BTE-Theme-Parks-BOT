exports.run = (client, message, args) => {
    message.channel.send("pong!").then(m => {
        var ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`pong! \`${ping}ms\``);
    }).catch(console.error);
};