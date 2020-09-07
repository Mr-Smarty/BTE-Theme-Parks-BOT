exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerID) {
        message.channel.send('Only the bot developer can run this command (for now... :eyes:).')
        return;
    }
    client.accessSpreadsheet(client.googleSpreadsheet, client.creds, message)
}