const fs = require('fs');

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch(err) {
            return cb && cb(err);
        }
    });
}

function scoreEmbed(messageObject, idArgument, int, client) {
    const scoreEmbed = new client.Discord.MessageEmbed()
    .setDescription(`Score for <@${idArgument.toString()}>: \`${int}\``)
    .setTimestamp()
    .setColor(client.info.embedHexcode);
    messageObject.channel.send(scoreEmbed);
}

exports.run = (client, message, args) => {
    let messageMentions = 0;
    if (message.mentions.members.first()) {
        messageMentions = message.mentions.members.first().id;
    }
    if (!args[0] || messageMentions == message.author.id || args[0] == message.author.id.toString()) {
        const userId = message.author.id;
        jsonReader('./scores.json', (err, score) => {
            if (err) {
                console.log(err);
                return;
            }
            if (score[userId]) {
                const scoreInt = score[userId];
                scoreEmbed(message, userId, scoreInt, client);
            } else {
                scoreEmbed(message, userId, 0, client);
            }

            if (score[userId] >= 20 && !message.member.roles.cache.has(client.ids.sBuilder)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Senior Builder');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 7` and are now a `Senior Builder`! Thank you for your activity and skill, we look forward to your builds in the future!');
            }
            if (score[userId] >= 15 && !message.member.roles.cache.has(client.ids.level6)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 6');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 6` and can place your head in the Hall of Fame on the BTE: Theme Parks server!');
            }
            if (score[userId] >= 10 && !message.member.roles.cache.has(client.ids.level5)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 5');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 5` and have access to <#749376102299861052>!');
            }
            if (score[userId] >= 8 && !message.member.roles.cache.has(client.ids.level4)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 4');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 4`!');
            }
            if (score[userId] >= 6 && !message.member.roles.cache.has(client.ids.level3)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 3');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 3`!');
            }
            if (score[userId] >= 4 && !message.member.roles.cache.has(client.ids.level2)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 2');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 2` and can post attachments and links in <#704350088843100160> and <#709971609389105244>!');
            } 
            if (score[userId] >= 2 && !message.member.roles.cache.has(client.ids.level1)) {
                const role = message.guild.roles.cache.find(role => role.name === 'Builder: Level 1');
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 1` and can post in <#704355790127104010>!');
            }
        });
    } else
    if (messageMentions !== 0 || args[0] !== message.author.id.toString()) {
        if (messageMentions == 0) {
            jsonReader('./scores.json', (err, score) => {
                const userId = args[0];
                if (err) {
                    console.log(err);
                    return;
                }
                if (!message.guild.members.cache.some(u => u.id === userId)) {
                    message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank');
                    return;
                }
                if (score[userId]) {
                    const scoreInt = score[userId];
                    scoreEmbed(message, userId, scoreInt, client);
                } else {
                    scoreEmbed(message, userId, 0, client);
                }
            });
        } else {
            jsonReader('./scores.json', (err, score) => {
                const userId = messageMentions.toString();
                if (err) {
                    console.log(err);
                    return;
                }
                if (!message.guild.members.cache.some(u => u.id === messageMentions)) {
                    message.channel.send('Please give a valid user ID, valid mention, or leave the arguments blank');
                    return;
                }
                if (score[userId]) {
                    const scoreInt = score[userId];
                    scoreEmbed(message, userId, scoreInt, client);
                } else {
                    scoreEmbed(message, userId, 0, client);
                }
            });
        }
    }
};