module.exports = async (client, member) => {
    const guild = member.guild;
    const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
    client.channels.cache.get('760516446585094194').setName(`Member Count: ${memberCount}`);
}