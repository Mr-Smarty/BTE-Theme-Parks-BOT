module.exports = async (client, channel, time) => {
    if(channel.name == undefined) return;
    var pinned;
    var botPin;
    channel.messages.fetchPinned(true).then(pins => {
        pinned = pins.first(); 
        botPin = pins.last();

        if(pinned.author.id == client.user.id) return;

        if(client.parks.some(elem => {return elem._channel == channel.id})) {
            botPin.unpin({reason: 'hoisting'}).then(msg => msg.pin({reason: 'hoisting'})).then(() => channel.messages.fetch({limit: 1}).then(msg => msg.first().delete()));
        }
    });
}