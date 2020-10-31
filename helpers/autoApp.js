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
    const user = await client.users.cache.find(u => u.tag === appSubmitted.Username);
    if (user == undefined) {
        rows[filledRows.length - 1].result = false;
        await rows[filledRows.length - 1].save();
        return message.channel.send('The username format is incorrect, or the user is not in this server! Application denied.');
    }
    
    const userToMember = message.guild.member(user)
    if(userToMember.roles.cache.has('704354906450034708')) {
        rows[filledRows.length - 1].result = true;
        await rows[filledRows.length - 1].save();
        return message.channel.send('The user is already is a builder! Application accepted.');
    }
    
    if (!userToMember.roles.cache.has('769353222078332928')) {
        client.verify.run().then(async r =>  {
            if (r.includes(user.tag)) {
                userToMember.roles.add(message.guild.roles.cache.find(r => r.name === "Verified"))
            } else {
                rows[filledRows.length - 1].result = false;
                await rows[filledRows.length - 1].save();
                await message.channel.send('The user is not verified! Application denied.');
                return user.send('Please join the **BTE: Theme Parks** team at https://buildtheearth.net/buildteams/121/join before applying for the team. \nOnce you have joined, use the command `=verify` in the server, then reapply.').catch(() => message.channel.send('Error alerting user.'))
            }
        })
    }

    let all = await ifUAppExists(filledRows, appSubmitted.Username)
    all.pop()
    if(all.length >= 1) {
        all.forEach(async r => {
            rows[r].result = false;
            await rows[r].save();
        })
    }
}