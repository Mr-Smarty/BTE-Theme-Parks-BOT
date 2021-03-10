exports.run = (client, message, args) => {
    client.ping.status(client.config.server.IP, { port: client.config.server.port, enableSRV: true, timeout: 5000, protocolVersion: 47 }).then(response => {        
        if (response.samplePlayers === null) {
            if (response.onlinePlayers === 0) {
                const noPlayerEmbed = new client.Discord.MessageEmbed()
                .setTitle('Online Players')
                .setColor(client.info.embedHexcode)
                .setDescription('No players are online :confused:')
                .setTimestamp();
                message.channel.send(noPlayerEmbed);  
            } else {
                const manyPlayersEmbed = new client.Discord.MessageEmbed()
                .setTitle('Online Players')
                .setColor(client.info.embedHexcode)
                .setDescription("There's too many players to list! :open_mouth:")
                .setTimestamp();
                message.channel.send(manyPlayersEmbed);
            }
        } else {
            let players = [];
            let max = response.samplePlayers.length;

            for (x = 0; x < max; x++) {
                players[x] = response.samplePlayers[x].name;
            }

            const playerEmbed = new client.Discord.MessageEmbed()
            .setTitle('Online Players')
            .setColor(client.info.embedHexcode)
            .setDescription(players)
            .setTimestamp();
            message.channel.send(playerEmbed);
        }
    }).catch(() => {
        const errorEmbed = new client.Discord.MessageEmbed()
        .setTitle('Server Status')
        .setColor(client.info.embedHexcode)
        .setDescription('Offline :pensive: Contact AdamW#0451')
        .setTimestamp();
        return message.channel.send(errorEmbed);
    });
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=players`",
    description: "**Usage:** `=players`\n**Description:** Lists online players in the BTE: Theme Parks Minecraft server. \n**Requirements:** none"
}};

exports.permLevel = 0;
exports.name = 'players';