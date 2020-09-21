module.exports = async (client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === '717832342550610113') {
        if (reaction.emoji.id === '705550277339644017') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950515470925835');
        } else
        if (reaction.emoji.name === '🦁') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('740307771085422672');
        } else
        if (reaction.emoji.id === '717839235788439572') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951008436125856');
        } else
        if (reaction.emoji.id === '748790956979126292') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('744380828464840835');
        } else
        if (reaction.emoji.name === '🐴') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951457570324491');
        } else
        if (reaction.emoji.name === '🍫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('715301522526699602');
        } else
        if (reaction.emoji.name === '👑') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('713431350027485284');
        } else
        if (reaction.emoji.name === '⛵') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950648862638161');
        } else
        if (reaction.emoji.name === '🐋') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950659473965146');
        } else
        if (reaction.emoji.id === '731224218598899843') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951358459183106');
        } else
        if (reaction.emoji.id === '749407387709997056') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('749407113117171882');
        }
    }
}