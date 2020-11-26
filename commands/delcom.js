exports.run = (client, message, args) => {
    if(!message.member.roles.cache.has(client.ids.adminRoleID)) return message.channel.send('Only an admin can delete commands.');
    if(!args[0]) return message.channel.send('Please specify the command name.');
    
    let cmd = args[0].toLowerCase();

    if(client.commands.has(cmd)) return message.channel.send('This command cannot be deleted.');
    if(!client.responses.has(cmd)) return message.channel.send('This command does not exist!');

    message.channel.send(`Are you sure you would like to delete the command \`${cmd}\`? Type \`yes\` to confirm or \`no\` to cancel.`).then(() => {
        const filter = m => m.author.id == message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
        message.channel.awaitMessages(filter, {max: 1, time: 16000, errors: ['time']}).then(response => {
            console.log(response)
            switch(response.first().content.toLowerCase()) {
                case 'yes':
                    client.responses.delete(`${cmd}`)
                    response.first().react('✅');
                    break;
                case 'no':
                    message.channel.send('Operation cancelled.');
                    break;
            }
		}).catch(() => {
            message.channel.send('Operation cancelled: timed out');
        });
    });
};