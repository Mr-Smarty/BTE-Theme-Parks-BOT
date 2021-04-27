module.exports = async (client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === '749302258239275069' && reaction.emoji.name === '✅') {
        const userId = await reaction.message.author.id;
        await client.scores.ensure(`${userId}`, 0);
        await client.scores.inc(`${userId}`)
        reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
        .then(() => reaction.message.react('☑️'));

        const scoreInt = client.scores.get(`${userId}`);
        const member = reaction.message.member
        const user = reaction.message.author
        const roleCache = reaction.message.member.roles.cache
        const guildRoleCache = reaction.message.guild.roles.cache

        if (scoreInt >= 30 && !roleCache.has(client.ids.level8)) {
            const role = guildRoleCache.get(client.ids.level8);
            member.roles.add(role);
            user.send('Umm... uhh.. ¯\\_(ツ)_/¯').catch(() => {})
        }
        if (scoreInt >= 20 && !roleCache.has(client.ids.level7)) {
            const role = guildRoleCache.get(client.ids.level7);
            member.roles.add(role);
            const role2 = guildRoleCache.get(client.ids.lBuilder);
            member.roles.add(role2);
            user.send('Congratulations! You have reached `Builder: Level 7` and are now a `Legendary Builder`! We appreciate your contributions to this project and our team greatly. We look forwards to building with you more! You have ranked up very far as a builder, but something greater lies ahead.').catch(() => {});
        }
        if (scoreInt >= 16 && !roleCache.has(client.ids.level6)) {
            const role = guildRoleCache.get(client.ids.level6);
            member.roles.add(role);
            user.send('Congratulations! You have reached `Builder: Level 6` and can place your head in the **Hall of Fame** on the BTE: Theme Parks server!').catch(() => {});
        }
        if (scoreInt >= 12 && !roleCache.has(client.ids.level5)) {
            const role = guildRoleCache.get(client.ids.level5);
            member.roles.add(role);
            const role2 = guildRoleCache.get(client.ids.sBuilder);
            member.roles.add(role2);
            user.send('Congratulations! You have reached `Builder: Level 5` and are now a `Senior Builder`! Thank you for your activity and skill, we look forward to your builds in the future!').catch(() => {});
        }
        if (scoreInt >= 8 && !roleCache.has(client.ids.level4)) {
            const role = guildRoleCache.get(client.ids.level4);
            member.roles.add(role);
            user.send('Congratulations! You have reached `Builder: Level 4` and have access to <#749376102299861052>!').catch(() => {});
        }
        if (scoreInt >= 5 && !roleCache.has(client.ids.level3)) {
            const role = guildRoleCache.get(client.ids.level3);
            member.roles.add(role);
            const role2 = guildRoleCache.get(client.ids.aBuilder);
            member.roles.add(role2);
            user.send('Congratulations! You have reached `Builder: Level 3` and have become an `Advanced Builder`! Thanks for building with us!').catch(() => {});
        }
        if (scoreInt >= 2 && !roleCache.has(client.ids.level2)) {
            const role = guildRoleCache.get(client.ids.level2);
            member.roles.add(role);
            user.send('Congratulations! You have reached `Builder: Level 2` and can post in <#704355790127104010>!').catch(() => {});
        } 
        if (scoreInt >= 1 && !roleCache.has(client.ids.level1)) {
            const role = guildRoleCache.get(client.ids.level1);
            member.roles.add(role);
            user.send('Congratulations! You have reached `Builder: Level 1` and can post attachments and embed links!').catch(() => {});
        }
    } else

    if (reaction.message.channel.id === client.ids.getRoles) {
        let park = await client.Park.get(client, client.parks, client.parks.find(park => park._emoji == reaction.emoji.toString())._name);
        let role = park._role;
        let member = reaction.message.guild.members.cache.get(user.id);
        if(member.roles.cache.has(role.id)) {
            member.roles.remove(role);
            user.send(`You have been removed from the role \`${role.name}\`.`).catch(() => {});
            reaction.users.remove(user);
        } else {
            member.roles.add(role);
            user.send(`You have been added to the role \`${role.name}\`.`).catch(() => {});
            reaction.users.remove(user);
        }
    }
}