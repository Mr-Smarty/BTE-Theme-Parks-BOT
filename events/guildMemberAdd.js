module.exports = async (client, member) => {
    const memberCount = member.guild.memberCount - 3
    client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);

    client.verify.run(client.config.apiKey, client).then(r => {
        if (r.includes(member.user.tag)) member.roles.add(member.guild.roles.cache.find(r => r.name === "Verified")), client.sendLog.run(client, member.user, undefined, `<@!${member.user.id}>** (${member.user.tag}) was verified when joining.**`, null, {"User ID": member.user.id}, 'POSITIVE');
    })
}