module.exports = (client, oldMsg, newMsg) => {
    if(newMsg.channel.id == '714328084920402020') {
        let last = parseInt(oldMsg.content.match(/\d+/g)[0])
        newMsg.channel.send(`${newMsg.member.toString()} broke the chain at hi #${last} by editing their message!`).then(() => {
            newMsg.channel.send('hi #1');
        });
    }
}