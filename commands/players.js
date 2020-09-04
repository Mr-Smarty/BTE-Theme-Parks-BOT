exports.run = (client, message, args) => {
    client.ping('themeparks.wither.host', 25650, (error, response) => {
        if (error) {
            const errorEmbed = new client.Discord.MessageEmbed()
            .setTitle('Server Status')
            .setColor(client.info.embedHexcode)
            .setDescription('Offline :pensive: Contact AdamW#0451')
            .setTimestamp()
            message.channel.send(errorEmbed);
            return;
        }
        
        if (response.samplePlayers === null) {
            if (response.onlinePlayers === 0) {
                const noPlayerEmbed = new client.Discord.MessageEmbed()
                .setTitle('Online Players')
                .setColor(client.info.embedHexcode)
                .setDescription('No players are online :confused:')
                .setTimestamp()
                message.channel.send(noPlayerEmbed);  
            } else {
                const manyPlayersEmbed = new client.Discord.MessageEmbed()
                .setTitle('Online Players')
                .setColor(client.info.embedHexcode)
                .setDescription("There's too many players to list! :open_mouth:")
                .setTimestamp()
                message.channel.send(manyPlayersEmbed);
            }
        } else {
            let players = [];
            let max = response.samplePlayers.length;

            for (x = 0; x < max; x++) {
                players[x] = response.samplePlayers[x].name;
            }
            console.log(players)

            const playerEmbed = new client.Discord.MessageEmbed()
            .setTitle('Online Players')
            .setColor(client.info.embedHexcode)
            .setDescription(players)
            .setTimestamp()
            message.channel.send(playerEmbed);
        }
        console.log(response);
    });
}