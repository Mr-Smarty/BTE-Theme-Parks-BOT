exports.run = (client, message, args) => {
    client.ping(client.config.server.IP, client.config.server.port, (error, response) => {
        if (error) {
            const errorEmbed = new client.Discord.MessageEmbed()
            .setTitle('Server Status')
            .setColor(client.info.embedHexcode)
            .setDescription('Offline :pensive: Contact AdamW#0451')
            .setTimestamp();
            message.channel.send(errorEmbed);   
            return;        
        }
        
        const serverEmbed = new client.Discord.MessageEmbed()
        .setTitle('Server Status')
        .setColor(client.info.embedHexcode)
        .setDescription('Online! :thumbsup:')
        .addField('Server IP', response.host + ':' + response.port)
        .addField('Server Version', response.version)
        .addField('Online Players', response.onlinePlayers + '\n' + '\n Use `=players` to view online players')
        .addField('Server Description', response.descriptionText.replace(/§./g, ""))
        .setTimestamp();
        message.channel.send(serverEmbed);
    });
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=server`",
    description: "**Usage:** `=server`\n**Description:** Gives information and status of the BTE: Theme Parks Minecraft server. \n**Requirements:** none"
}};

exports.permLevel = 0;
exports.name = 'server';