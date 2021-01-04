exports.run = (client, message, args) => {
    if(!message.member.roles.cache.has(client.ids.adminRoleID)) return message.channel.send('Only an admin can delete commands.');
    if(!args[0]) return message.channel.send('Please specify the command name.');
    
    let cmd = args[0].toLowerCase();

    if(client.commands.has(cmd)) return message.channel.send('This command cannot be deleted.');
    if(!client.responses.has(cmd)) return message.channel.send('This command does not exist!');

    message.channel.send(`Are you sure you would like to delete the command \`${cmd}\`? Type \`yes\` to confirm or \`no\` to cancel.`).then(() => {
        const filter = m => m.author.id == message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
        message.channel.awaitMessages(filter, {max: 1, time: 16000, errors: ['time']}).then(response => {
            switch(response.first().content.toLowerCase()) {
                case 'yes':
                    client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) deleted the command:**\n\`=${cmd}\`: ${(client.responses.get(cmd, 'isEmbed') ? 'Here is its embed response data:\n```' + JSON.stringify(client.responses.get(cmd, 'response'), null, 2) + '```' : client.responses.get(cmd, 'response'))}`, undefined, {"User ID": message.author.id}, 'NEGATIVE');
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

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=delcom`",
    description: "**Usage:** `=delCom <command name>` \n**Description:** Deletes a created, simple call-and-response command. To confirm command deletion, type `yes` when prompted or type `no` to cancel. If one of these is not typed in 16 seconds, the operation will be canceled. \n**Requirements:** Admin"  
}};

exports.permLevel = 5;
exports.name = 'delcom';