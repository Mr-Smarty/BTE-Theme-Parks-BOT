async function ifAppExists(rows, arg) {
    const rowCount = await rows.length;
    let apps = [];
    for (let i = 0; i < rowCount; i++) {
        if (rows[i].Username == arg) apps.push(i);
    }
    return apps;
}

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has(client.ids.modRoleID) && !message.member.roles.cache.has(client.ids.trialModRoleID)) {
        message.channel.send('You must have the `Trial Moderator` or `Moderator` role to use application commands.');
        return;
    } else
    if (message.channel.id !== '739239527431798805') {
        message.channel.send('Please use <#739239527431798805> for application commands.');
        return;
    }
    if (args) {
        switch (args[0]) {
            case 'review':
                sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
                const rows = await sheet.getRows({
                    offset: 0
                });
                if (!args[1]) {
                    const rowCount = await rows.length;
                    let unreviewed = [];
                    let minus = 0;
                    for (let n = 0; n < rowCount; n++) {
                        if (rows[n].Username == undefined) return;
                        if (rows[n].result == undefined) {
                            unreviewed[n-minus] = rows[n].Username
                        } else minus++
                    }
                    if (unreviewed[0] == undefined) {
                        message.channel.send('No unreviewed applications!')
                        return;
                    }
                    const reviewEmbed = new client.Discord.MessageEmbed()
                    .setTitle('Unreviewed applicants')
                    .setColor(client.info.embedHexcode)
                    .setDescription(unreviewed)
                    message.channel.send(reviewEmbed)
                } else {
                    const apps = await ifAppExists(rows, args[1]);
                    if (!apps.length > 0) {
                        message.channel.send("An application for that user doesn't exist!");
                        return;
                    } else {
                        if (apps.length > 1) message.channel.send('There are multiple unreviewed applications from this user. Here is the latest:')
                        const row = apps.pop()
                        const applicant = rows[row].Username
                        
                        const ans1 = rows[row].Minecraft_Username
                        const ans2 = rows[row].Links
                        const ans3 = rows[row].Hours
                        const timestamp = rows[row].Timestamp
                        
                        const embed = new client.Discord.MessageEmbed()
                        .setTitle(`Builder application for ${applicant}:`)
                        .setColor(client.info.embedHexcode)
                        .addField('What is your Minecraft username?', ans1)
                        .addField('Please give a link or multiple links to screenshots of 3+ buildings you have built with the BuildTheEarth modpack.', ans2)
                        .addField('How many hours per week can you dedicate towards building?', ans3)
                        .setFooter(`Submitted ${timestamp}`)
                        message.channel.send(embed)
                    }
                }
                break;
            case 'accept':
                if (!args[1]) {
                    message.channel.send('Please give a user to accept in this format: name#1234');
                    return;
                }
                const user = await client.users.cache.find(u => u.tag === args[1])
                if (user == undefined) {
                    message.channel.send('The user argument format is incorrect, or the user is not in this server!');
                    return;
                }
                const userID = user.id

                sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
                const rows1 = await sheet.getRows({
                    offset: 0
                });
                
                const apps = await ifAppExists(rows1, args[1])
                if (!apps.length > 0) {
                    message.channel.send("An application for that user doesn't exist!");
                    return;
                } else {
                    const userToMember = message.guild.member(user)
                    userToMember.roles.add('704354906450034708')
                    const row = apps.pop()
                    rows1[row].result = true
                    await rows1[row].save();
                    message.channel.send(`**${args[1]}** was accepted!`)
                    await client.users.cache.get(userID).send('Your application for builder has been accepted!')
                    if (apps.length > 0) {
                        apps.forEach(async r => {
                            rows1[r].result = false
                            await rows1[r].save()
                        })
                    }
                }
                break;
            case 'deny':
                if (!args[1]) {
                    message.channel.send('Please give a user to deny in this format: name#1234');
                    return;
                }
                let reason = args.slice(2).join(" ");
                if (reason.length < 1) {
                    message.channel.send('Please give a reason for denial.')
                    return;
                }
                const user1 = await client.users.cache.find(u => u.tag === args[1])
                if (user1 == undefined) {
                    message.channel.send('The user argument format is incorrect, or the user is not in this server!');
                    return;
                }
                const userID1 = user1.id

                sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
                const rows2 = await sheet.getRows({
                    offset: 0
                });
                
                const apps2 = await ifAppExists(rows2, args[1])
                if (!apps2.length > 0) {
                    message.channel.send("An application for that user doesn't exist!");
                    return;
                } else {
                    const userToMember = message.guild.member(user1)
                    userToMember.roles.remove('704354906450034708')
                    const row = apps2.pop()
                    rows2[row].result = false
                    await rows2[row].save();
                    message.channel.send(`**${args[1]}** was denied. \n**Reason:** ${reason}`)
                    await client.users.cache.get(userID1).send(`Your application for builder has been denied. \n**Reason:** ${reason}`)
                    if (apps2.length > 0) {
                        apps2.forEach(async r => {
                            rows2[r].result = false
                            await rows2[r].save()
                        })
                    }
                }
                break;
            default:
                message.channel.send('Please give a valid argument.')
        }
    } else message.channel.send('Please give a valid argument.')
}