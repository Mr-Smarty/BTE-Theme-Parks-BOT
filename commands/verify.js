exports.run = (client, message, args) => {
    let msg = undefined
    message.channel.send('Getting data...').then(message => msg = message)
    client.verify.run().then(r => {
        if (r.includes(message.author.tag)) {
            if (!message.member.roles.cache.has('769353222078332928')) {
                message.member.roles.add(message.guild.roles.cache.find(r => r.name === "Verified")).then(() => {
                    msg.delete()
                    const embed = new client.Discord.MessageEmbed()
                    .setColor(client.info.embedHexcode)
                    .setTitle('Verified! :white_check_mark:')
                    message.channel.send(embed)
                })
            } else {
                msg.delete()
                const embed = new client.Discord.MessageEmbed()
                .setColor(client.info.embedHexcode)
                .setTitle('Verification failed :x:')
                .setDescription('You are already verified!')
                message.channel.send(embed)
            }
        } else {
            const embed = new client.Discord.MessageEmbed()
            .setColor(client.info.embedHexcode)
            .setTitle('Verification failed :x:')
            .setDescription('Please apply for the team [here](https://buildtheearth.net/buildteams/121/join).\nOnce accepted, use `=apply` again.')
            msg.delete()
            message.channel.send(embed)
        }
    }).catch(err => {
        msg.delete()
        message.channel.send('There was an error fetching data :x:')
        console.error('VERIFICATION ERROR:\n' + err);
    })
}