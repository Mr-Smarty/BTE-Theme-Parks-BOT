exports.run = async (client, message, args) => {
    if (!message.channel.id === '717832342550610113') return;

    const reactionMessage = '**__Reaction Role Menu__** \nReact below to get your park roles. \n\n' + client.info.emojis.AltonTowers + ' : `Alton Towers` \n\n:lion_face: : `Busch Gardens Tampa` \n\n' + client.info.emojis.Busch + ' : `Busch Gardens Williamsburg` \n\n' + client.info.emojis.Carowinds + ' : `Carowinds` \n\n:horse: : `Chessington: World of Adventures` \n\n:chocolate_bar: : `Hershey Park` \n\n:crown: : `Kings Dominion` \n\n:sailboat: : `PortAventura World` \n\n:whale: : `SeaWorld Orlando` \n\n' + client.info.emojis.SixFlags + ' : `Six Flags Great Adventure` \n\n' + client.info.emojis.Canobie + ' : `Canobie Lake Park` \n\n:palm_tree: : `Fantasy Island`\n';
        
    let msg = await message.channel.send(reactionMessage);
    msg.react('705550277339644017')
    .then(() => msg.react('🦁'))
    .then(() => msg.react('717839235788439572'))
    .then(() => msg.react('748790956979126292'))
    .then(() => msg.react('🐴'))
    .then(() => msg.react('🍫'))
    .then(() => msg.react('👑'))
    .then(() => msg.react('⛵'))
    .then(() => msg.react('🐋'))
    .then(() => msg.react('731224218598899843'))
    .then(() => msg.react('749407387709997056'))
    .then(() => msg.react('🌴'))
    .catch(() => console.error('One of the emojis failed to react.'));

    client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) created the park reaction role menu.`, null, {"Sender ID": message.author.id});
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=reactions`",
    description: "**Usage:** `=reactions` \n**Description:** Sets up reaction roles for parks. \n**Requirements:** <#717832342550610113>"
}};

exports.permLevel = 5;
exports.name = 'reactions';