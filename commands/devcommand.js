exports.run = (client, message, args) => {
    if (message.author.id !== client.config.ownerID) return;
    message.channel.send("dev").catch(console.error);
}