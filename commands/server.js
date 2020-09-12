exports.run = (client, message, args) => {
    client.ping('themeparks.wither.host', 25650, (error, response) => {
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
        .addField('Server Description', response.descriptionText)
        .setTimestamp();
        message.channel.send(serverEmbed);
     
        console.log(response);
    });
};