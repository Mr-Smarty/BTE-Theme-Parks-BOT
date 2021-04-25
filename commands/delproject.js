var extraMessage = '**In order to actually build in these parks, you need to have the __Builder__ role in this discord server. If you are a Builder and would like to build in the __Universal Orlando Resort__ or __Disneyland Resort__, you can find more information by viewing their respective channels.**\nClick a reaction once to add a role and again to remove it.'
var extraMessage2 = '​\nIf you would like to build in any of these existing projects, you are more than welcome to - many of them are still under construction! Please ask a member of our staff team for details.\n**Most parks have their own park-specific channels - if you would like to view the channel for your park, click the reactions in <#717832342550610113>.**'

exports.run = (client, message, args) => {
    let start = new Date();

    let archive = args[1] ? (args[1].toLowerCase() == 'false' ? false : true) : true;
    if(!client.parks.indexes.includes(args[0])) return message.channel.send('That project does not exist!');

    message.channel.send(`Are you sure you would like to delete the project \`${args[0]}\`${archive ? '' : ' and delete its channel permanently'}? Type \`yes\` to confirm or \`no\` to cancel.`).then(() => {
        const filter = m => m.author.id == message.author.id && (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
        message.channel.awaitMessages(filter, {max: 1, time: 16000, errors: ['time']}).then(async response => {
            switch(response.first().content.toLowerCase()) {
                case 'yes':
                    try {
                        let park = await client.Park.get(client, client.parks, args[0]);
                        let name = park.name;

                        if(archive) {
                            park.channel.setParent(client.ids.archivedProjects, {reason: 'Archiving project channel'});
                        } else park.channel.delete('Deleting project channel');

                        await park.role.delete('Deleting project role');
                        
                        client.parks.delete(args[0]);
                        client.Park.reloadReactionRoles(client.parks, client, extraMessage)
                        .then(() => client.Park.reloadProjectList(client.parks, client, extraMessage2))
                        .then(() => message.react('✅'))
                        .then(() => {
                            let elapsed = `${(new Date() - start)}ms`;
                            client.sendLog.run(client, message.author, `The project \`${name}\` has been deleted.`, `${message.member.toString()} has deleted the project \`${name}\` and the channel has ${archive ? 'been archived' : 'been deleted'}.`, undefined, {"Processing Time": elapsed}, 'NEGATIVE');
                        });
                    } catch (error) {
                        return message.channel.send(`An error occured: \n\`\`\`${error.stack || error}\`\`\``);
                    }
                    break;
                case 'no':
                    message.channel.send('Operation cancelled.');
                    break;
            }
		}).catch(() => {
            message.channel.send('Operation cancelled: timed out');
        });
    });
}

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=delProject`",
    description: "**Usage:** `=delProject <name> [archive: true OR false]`\n**Description:** Delete a project and all data and assets related to it (role, channel, etc). The project channel is archived by default.\n**Requirements:** Admin"
}};

exports.permLevel = 5;
exports.name = 'delproject';