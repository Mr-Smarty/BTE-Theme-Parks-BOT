module.exports = async (client, member) => {
    const memberCount = member.guild.memberCount - 3
    client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);
}