exports.run = (client, user, title, description, fields, extraInfo, type = 'NEUTRAL') => {
    const embed = new client.Discord.MessageEmbed();

    switch (type) {
        case 'NEUTRAL':
            embed.setColor(client.info.embedHexcode);
            break;
        case 'POSITIVE':
            embed.setColor('#43b581');
            break;
        case 'NEGATIVE':
            embed.setColor('#ff470f');
            break;
        default:
            embed.setColor(client.info.embedHexcode);
            break;
    }
    
    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    if(Array.isArray(fields)) fields.forEach(field => embed.addField(field.name, field.value, field.inline || false));

    embed.setAuthor(user.tag, user.displayAvatarURL({format: 'png', dynamic: true}), `https://discordapp.com/users/${user.id}/`);
    
    if(typeof extraInfo === 'object' && extraInfo !== null) {
        var footer = '';
        Object.entries(extraInfo).forEach(entry => {
            const [key, value] = entry;
            footer += `${key}: ${value} | `;
        });
        footer = footer.slice(0, -3);
        embed.setFooter(footer);
    }

    embed.setTimestamp();

    client.channels.fetch(client.ids.logs).then(channel => channel.send(embed).then(() => {return}).catch(err => {return channel.send('Error sending log:\n```' + err + '```')}))
};