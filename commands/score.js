async function scoreEmbed(messageObject, idArgument, int, client) {
    const userAvatar = await messageObject.guild.members.fetch(idArgument).then(m => m.user.displayAvatarURL({format: 'png', dynamic: true}))
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
        message.guild.members.fetch(userId).then(() => {const pointsGiven = parseInt(args[2]);
            if (typeof pointsGiven !== 'number') return message.channel.send('Please give an integer')
            if (pointsGiven > 10 || pointsGiven < -10) return message.channel.send('Cannot give or take more than 10 points at a time.')
            
            client.scores.ensure(`${userId}`, 0)
            if ((client.scores.get(`${userId}`) + pointsGiven) < 0) return message.channel.send(`A user can not have less than 0 points. They currently have \`${client.scores.get(`${userId}`)}\` points.`)
            client.scores.math(`${userId}`, '+', pointsGiven)
            
            const embed = new client.Discord.MessageEmbed()
            .setDescription(`<@${userId}> now has \`${client.scores.get(`${userId}`)}\` points.`)
            .setColor(client.info.embedHexcode)
            message.channel.send(embed);

            client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) gave \`${pointsGiven}\` point(s) to **<@!${userId}>** (${client.users.cache.get(userId).tag}).**\nThey now have \`${client.scores.get(`${userId}`)}\` point(s).\n[Click here for context.](${message.url})`, null, {"Staff ID": message.author.id, "Subject ID": userId}, pointsGiven < 0 ? 'NEGATIVE' : 'POSITIVE');
            return;
        }).catch(() => {return message.channel.send('Please give a valid user ID.')}).finally(() => {return})
    } else
    if (args[0] == 'delete') {
        if (!message.member.roles.cache.has(client.ids.adminRoleID)) return;
        if (!args[1]) return message.channel.send('Please give a valid user ID.')

        const userId = args[1]
        client.scores.ensure(`${userId}`, 0)
        client.scores.delete(`${userId}`)
        message.channel.send(`Data for \`${userId}\` deleted.`)
        client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) deleted data for **<@!${userId}>** (${client.users.cache.get(userId).tag}) from the score database.**\n[Click here for context.](${message.url})`, null, {"Admin ID": message.author.id, "Subject ID": userId}, 'NEGATIVE');
    } else
    if (args[0] == 'reset') {
        if (!message.member.roles.cache.has(client.ids.modRoleID) && !message.member.roles.cache.has(client.ids.trialModRoleID)) return;
        if (!args[1]) return message.channel.send('Please give valid user ID.')
        client.users.fetch(args[1]).then(user => {
            const userId = args[1];
            client.updateCooldowns.ensure(user.id, false);
            client.updateCooldowns.set(user.id, false);
            message.react('✅');
            client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) reset the progress-update cooldown for **<@!${user.id}>** (${client.users.cache.get(userId).tag}).**\n[Click here for context.](${message.url})`, null, {"Staff ID": message.author.id, "Subject ID": user.id});
        }).catch(() => message.channel.send('A user with that ID does not exist!'))
        return;
    } else {
        let messageMentions = 0;
        if (message.mentions.members.first()) {
            messageMentions = message.mentions.members.first().id;
        }
        if (!args[0] || messageMentions == message.author.id || args[0] == message.author.id.toString()) {
            const userId = message.author.id;
            client.scores.ensure(`${userId}`, 0)
            const scoreInt = client.scores.get(`${userId}`);
            scoreEmbed(message, userId, scoreInt, client);

            if (scoreInt >= 30 && !message.member.roles.cache.has(client.ids.level8)) {
                const role = message.guild.roles.cache.get(client.ids.level8);
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Umm... uhh.. ¯\\_(ツ)_/¯');
            }
            if (scoreInt >= 20 && !message.member.roles.cache.has(client.ids.level7)) {
                const role = message.guild.roles.cache.get(client.ids.level7);
                message.guild.members.cache.get(userId).roles.add(role);
                const role2 = message.guild.roles.cache.get(client.ids.lBuilder);
                message.guild.members.cache.get(userId).roles.add(role2);
                message.channel.send('Congratulations! You have reached `Builder: Level 7` and are now a `Legendary Builder`! We appreciate your contributions to this project and our team greatly. We look forwards to building with you more! You have ranked up very far as a builder, but something greater lies ahead.');
            }
            if (scoreInt >= 16 && !message.member.roles.cache.has(client.ids.level6)) {
                const role = message.guild.roles.cache.get(client.ids.level6);
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 6` and can place your head in the **Hall of Fame** on the BTE: Theme Parks server!');
            }
            if (scoreInt >= 12 && !message.member.roles.cache.has(client.ids.level5)) {
                const role = message.guild.roles.cache.get(client.ids.level5);
                message.guild.members.cache.get(userId).roles.add(role);
                const role2 = message.guild.roles.cache.get(client.ids.sBuilder);
                message.guild.members.cache.get(userId).roles.add(role2);
                message.channel.send('Congratulations! You have reached `Builder: Level 5` and are now a `Senior Builder`! Thank you for your activity and skill, we look forward to your builds in the future!');
            }
            if (scoreInt >= 8 && !message.member.roles.cache.has(client.ids.level4)) {
                const role = message.guild.roles.cache.get(client.ids.level4);
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 4` and have access to <#749376102299861052>!');
            }
            if (scoreInt >= 5 && !message.member.roles.cache.has(client.ids.level3)) {
                const role = message.guild.roles.cache.get(client.ids.level3);
                message.guild.members.cache.get(userId).roles.add(role);
                const role2 = message.guild.roles.cache.get(client.ids.aBuilder);
                message.guild.members.cache.get(userId).roles.add(role2);
                message.channel.send('Congratulations! You have reached `Builder: Level 3` and have become an `Advanced Builder`! Thanks for building with us!');
            }
            if (scoreInt >= 2 && !message.member.roles.cache.has(client.ids.level2)) {
                const role = message.guild.roles.cache.get(client.ids.level2);
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 2` and can post in <#704355790127104010>!');
            } 
            if (scoreInt >= 1 && !message.member.roles.cache.has(client.ids.level1)) {
                const role = message.guild.roles.cache.get(client.ids.level1);
                message.guild.members.cache.get(userId).roles.add(role);
                message.channel.send('Congratulations! You have reached `Builder: Level 1` and can post attachments and embed links!');
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
    }
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=score`",
    description: "**Usage:** \n`=score [Member Mention OR User ID]`\n`=score give <User ID> <Integer>`\n`=score reset <User ID>`\n`=score delete <Enmap Key>`\n**Description:** Shows your score for the Builder Progress Updates system. Also levels you up and gives rewards when you reach a certain number of points. You will ONLY level up when you yourself uses this command. If a valid argument is given, it will give the score for the indicated user, this will not level them up. Use `=progress-updates` to learn more. To give or take points, give a user ID and an amount of points to give. (or use a negative number to take points) Use `=score reset` to reset a user's update cooldown. Use `=score delete` to delete info from the score database.\n**Requirements:** none \n**Requirements for `=score give`:** Moderator OR Trial Moderator \n**Requirements for `=score reset`:** Moderator OR Trial Moderator\n**Requirements for `=score delete`:** Admin"
}};

exports.permLevel = 0;
exports.name = 'score';