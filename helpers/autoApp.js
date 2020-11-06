let collabURLs = ['https://buildtheearth.net/buildteams/179/members'];

async function ifUAppExists(rows, arg) {
    const rowCount = await rows.length;
    let apps = [];
    for (let i = 0; i < rowCount; i++) {
        if (rows[i].Username == arg) {
            if (!rows[i].result) apps.push(i);
        }
    }
    return apps;
}

exports.run = async (client, message) => {
    sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
    const rows = await sheet.getRows({
        offset: 0
    });
    
    let filledRows = await rows.map(r => {
        if (r.Timestamp !== 'undefined') return r
        else return;
    });

    let appSubmitted = filledRows[filledRows.length - 1];
    console.log('NEW APP: ', appSubmitted.Username.substring(appSubmitted.Username.length - 4, appSubmitted.Username.length), appSubmitted.Username.substring(appSubmitted.Username.length - 5, 0))
    const member = await message.guild.members.cache.find(member => member.user.discriminator == appSubmitted.Username.substring(appSubmitted.Username.length - 4, appSubmitted.Username.length) && member.user.username == appSubmitted.Username.substring(appSubmitted.Username.length - 5, 0));
    if(member == undefined) {
        rows[filledRows.length - 1].result = false;
        await rows[filledRows.length - 1].save();
        return message.channel.send('The username format is incorrect, or the user is not in this server! Application denied.');
    }
    
    const user = member.user
    if(member.roles.cache.has('704354906450034708')) {
        rows[filledRows.length - 1].result = true;
        await rows[filledRows.length - 1].save();
        return message.channel.send('The user is already is a builder! Application accepted.');
    }
    
    if(!member.roles.cache.has('769353222078332928')) {
        client.verify.run('https://buildtheearth.net/buildteams/121/members').then(async r =>  {
            if(r.includes(user.tag)) {
                member.roles.add(message.guild.roles.cache.find(r => r.name === "Verified")).catch(err => console.error('ERROR GIVING VERFIED ROLE:\n' + err));
            } else {
                rows[filledRows.length - 1].result = false;
                await rows[filledRows.length - 1].save();
                await message.channel.send('The user is not verified! Application denied.');
                return user.send('Please join the **BTE: Theme Parks** team at https://buildtheearth.net/buildteams/121/join before applying for the team. \nOnce you have joined, use the command `=verify` in the server, then reapply.').catch(() => message.channel.send('Error alerting user.'));
            }
        });
    }

    let all = await ifUAppExists(filledRows, appSubmitted.Username);
    all.pop();
    if(all.length >= 1) {
        all.forEach(async r => {
            rows[r].result = false;
            await rows[r].save();
        });
    }

    collabURLs.forEach(url => client.verify.run(url).then(async r => {
        if(r.includes(user.tag)) {
            message.channel.send('The user is part of a collaborating build team. Application Accepted.');
            user.send('Your application for builder has been accepted!');
            rows[filledRows.length - 1].result = true;
            await rows[filledRows.length - 1].save();
            await member.roles.add(message.guild.roles.cache.find(r => r.name === "Builder")).catch(err => console.error('ERROR GIVING VERFIED ROLE:\n' + err));
            return;
        }
    }));
}