module.exports = async (client, member) => {
    const memberCount = member.guild.memberCount - 3
    client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);

    client.verify.run('https://buildtheearth.net/buildteams/121/members').then(r => {
        if (r.includes(member.user.tag)) member.roles.add(member.guild.roles.cache.find(r => r.name === "Verified"))
    })
}