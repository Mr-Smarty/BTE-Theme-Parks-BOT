const message = require("./message");

module.exports = async (client, member) => {
    const memberCount = member.guild.memberCount - 3
    client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);
    const user = member.user
    client.scores.ensure(`${user.id}`, 0)
    if (client.scores.get(`${user.id}`) > 0) {
        client.channels.cache.get('704382590039097395').send(`**${user.tag}** has left the server, \`${client.scores.get(`${user.id}`)}\` points removed.`)
    }
    client.scores.delete(`${user.id}`)
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