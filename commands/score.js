async function scoreEmbed(messageObject, idArgument, int, client) {
    const userAvatar = await messageObject.guild.members.fetch(idArgument).then(m => m.user.displayAvatarURL())
    const tag = await client.users.fetch(idArgument).then(u => u.username)
    const scoreEmbed = new client.Discord.MessageEmbed()
    .setDescription(`Score for <@${idArgument.toString()}>: \`${int}\``)
    .setAuthor(tag, userAvatar)
    .setTimestamp()
    .setColor(client.info.embedHexcode);
    messageObject.channel.send(scoreEmbed);
}

exports.run = (client, message, args) => {
    if (message.author.id == '671594544089006091' && args[0] == 'log') {
        console.log(client.scores);
        return;
    }
    if (args[0] == 'give') {
        if (!message.member.roles.cache.has(client.ids.modRoleID) && !message.member.roles.cache.has(client.ids.trialModRoleID)) return;
        if (!args[2]) return message.channel.send('Please give a valid user ID and an integer.');
        const userId = args[1];
        if (!message.guild.members.fetch(userId)) return message.channel.send('Please give a valid user ID.');
        const pointsGiven = parseInt(args[2]);
        if (typeof pointsGiven !== 'number') return message.channel.send('Please give an integer')
        if (pointsGiven > 10 || pointsGiven < -10) return message.channel.send('Cannot give or take more than 10 points at a time.')
        client.scores.ensure(`${userId}`, 0)
        if ((client.scores.get(`${userId}`) + pointsGiven) < 0) return message.channel.send(`A user can not have less than 0 points. They currently have \`${client.scores.get(`${userId}`)}\` points.`)
        client.scores.math(`${userId}`, '+', pointsGiven)
        const embed = new client.Discord.MessageEmbed()
        .setDescription(`<@${userId}> now has \`${client.scores.get(`${userId}`)} points.\``)
        .setColor(client.info.embedHexcode)
        message.channel.send(embed);
        return;
    }
    let messageMentions = 0;
    if (message.mentions.members.first()) {
        messageMentions = message.mentions.members.first().id;
    }
    if (!args[0] || messageMentions == message.author.id || args[0] == message.author.id.toString()) {
        const userId = message.author.id;
        client.scores.ensure(`${userId}`, 0)
        const scoreInt = client.scores.get(`${userId}`);
        scoreEmbed(message, userId, scoreInt, client);

        if (scoreInt >= 20 && !message.member.roles.cache.has(client.ids.sBuilder)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Senior Builder');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 7` and are now a `Senior Builder`! Thank you for your activity and skill, we look forward to your builds in the future!');
        }
        if (scoreInt >= 15 && !message.member.roles.cache.has(client.ids.level6)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 6');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 6` and can place your head in the Hall of Fame on the BTE: Theme Parks server!');
        }
        if (scoreInt >= 10 && !message.member.roles.cache.has(client.ids.level5)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 5');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 5` and have access to <#749376102299861052>!');
        }
        if (scoreInt >= 8 && !message.member.roles.cache.has(client.ids.level4)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 4');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 4`!');
        }
        if (scoreInt >= 6 && !message.member.roles.cache.has(client.ids.level3)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 3');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 3`!');
        }
        if (scoreInt >= 4 && !message.member.roles.cache.has(client.ids.level2)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 2');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 2` and can post attachments and links in <#704350088843100160> and <#709971609389105244>!');
        } 
        if (scoreInt >= 2 && !message.member.roles.cache.has(client.ids.level1)) {
            const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 1');
            message.guild.members.cache.get(userId).roles.add(role);
            message.channel.send('Congratulations! You have reached `Builder: Level 1` and can post in <#704355790127104010>!');
        }
    } else
    if (messageMentions !== 0 || args[0] !== message.author.id.toString()) {
        if (messageMentions == 0) {
            const userId = args[0];
            const test = parseInt(userId)
            if (isNaN(test)) return message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank');
            message.guild.members.fetch(userId).catch(() => message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank'))
            if (!message.guild.members.fetch(userId)) {
                message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank');
                return;
            }
            client.scores.ensure(`${userId}`, 0);
            scoreEmbed(message, userId, client.scores.get(`${userId}`), client);
        } else {
            const userId = messageMentions.toString();
            if (!message.guild.members.fetch(messageMentions)) {
                message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank');
                return;
            }
            client.scores.ensure(`${userId}`, 0);
            scoreEmbed(message, userId, client.scores.get(`${userId}`), client);
        }
    }
};