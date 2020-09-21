module.exports = async (client, member) => {
    client.channels.cache.get('739239527431798805').send('success')
    const user = member.user
    sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
    const rows = await sheet.getRows({
        offset: 0
    });
    let filledRows = await rows.map(r => {
        if (r.Timestamp !== 'undefined') return r
        else return;
    });
    const rowCount = await filledRows.length;
    let apps = [];
    for (let i = 0; i < rowCount; i++) {
        if (filledRows[i].Username == user.tag) {
            if (!filledRows[i].result) apps.push(i);
        }
    }
    if (apps.length == 0) return
    else {
        apps.forEach(async r => {
            rows[r].result = false;
            await rows[r].save();
        });
        client.channels.cache.get('739239527431798805').send(`**${user.tag}** has left the server. Any unreviewed applications denied.`);
    }
}