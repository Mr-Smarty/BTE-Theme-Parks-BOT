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
                message.channel.send('accept')
                break;
            case 'deny':
                message.channel.send('deny')
                break;
            default:
                message.channel.send('Please give a valid argument.')
        }
    } else message.channel.send('Please give a valid argument.')
    sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds, message)
    const rows = await sheet.getRows({
        offset: 1
    })
    /*
    message.channel.send(rows[0].Timestamp)
    message.channel.send(sheet.title)
    */
}