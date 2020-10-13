exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerID) return message.channel.send('Only the bot developer can restart the bot.');
    if (message.channel.id !== '704382150450872430') return message.channel.send('Please use <#704382150450872430>.');
    
    message.channel.send('Restarting...').then(msg => {
        client.lastRestart.set('id', msg.id)
        process.exit()
    })
}