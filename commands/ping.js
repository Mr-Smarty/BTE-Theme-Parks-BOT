exports.run = (client, message, args) => {
    message.channel.send("pong!").then(m => {
        var ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`pong! \`${ping}ms\``);
    }).catch(console.error);
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=ping`",
    description: "**Usage:** `=ping`\n**Description:** Test command to see if the bot is running or if you are bored \n**Requirements:** none"
}};

exports.permLevel = 0;
exports.name = 'ping';