exports.run = (client, message, args) => {
    if (args.length !== 0) {
        if (!client.commands.has(args[0].toLowerCase())) {
            if(client.responses.has(args[0].toLowerCase())) return message.channel.send(`This is a custom info command. Its usage is \`=${args[0].toLowerCase()}\` and everyone has permission to use it.`)
            return message.channel.send(`The command \`=${args[0]}\` doesnt exist!`);
        }
        if (args[0].toLowerCase() === 'modsay' && message.channel.parent.id !== ('718967444294860873' || '704382526902501376')) return message.channel.send(client.commands.get(`${args[0].toLowerCase()}`, 'noHelp'));
        message.channel.send(client.commands.get(`${args[0].toLowerCase()}`, 'help'))
    } else {
    const infoCommandList = client.responses.indexes.map(elem => {return `=${elem}`});
    if (message.author.id == client.config.ownerID) {
        const commandList = client.commands.map(elem => {if(elem.permLevel >= -1) return `=${elem.name}`; else return;})
        
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `DEV`")
        .setColor(client.info.embedHexcode)
        .setDescription('Use `=commands <command name>` to get more info about a certain command.')
        .addField('Commands', commandList.join('\n'), true)
        .addField('Info Commands', infoCommandList.join('\n'), true)
        .setTimestamp()
        .setFooter(`Commands for ${message.author.tag}`, message.author.displayAvatarURL('webp', true));
        return message.channel.send(commandEmbed);
    } else
    if (message.member.roles.cache.has(client.ids.adminRoleID)) {
        const commandList = client.commands.map(elem => {if(elem.permLevel >= 0 && elem.permLevel <= 5) return `=${elem.name}`; else return;})
        
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `ADMIN`")
        .setDescription('Use `=commands <command name>` to get more info about a certain command.')
        .setColor(client.info.embedHexcode)
        .addField('Commands', commandList.join('\n'), true)
        .addField('Info Commands', infoCommandList.join('\n'), true)
        .setTimestamp()
        .setFooter(`Commands for ${message.author.tag}`, message.author.displayAvatarURL('webp', true));
        return message.channel.send(commandEmbed);
    } else
    if (message.member.roles.cache.has(client.ids.modRoleID) || message.member.roles.cache.has(client.ids.trialModRoleID)) {
        const commandList = client.commands.map(elem => {if(elem.permLevel >= 0 && elem.permLevel <= 4) return `=${elem.name}`; else return;})
        
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `MOD | TRIAL MOD`")
        .setDescription('Use `=commands <command name>` to get more info about a certain command.')
        .setColor(client.info.embedHexcode)
        .addField('Commands', commandList.join('\n'), true)
        .addField('Info Commands', infoCommandList.join('\n'), true)
        .setTimestamp()
        .setFooter(`Commands for ${message.author.tag}`, message.author.displayAvatarURL('webp', true));
        return message.channel.send(commandEmbed);
    } else {
        const commandList = client.commands.map(elem => {if(elem.permLevel == 0) return `=${elem.name}`; else return;})
        
        const commandEmbed = new client.Discord.MessageEmbed()
        .setTitle("Available Commands: `VISITOR`")
        .setDescription('Use `=commands <command name>` to get more info about a certain command.')
        .setColor(client.info.embedHexcode)
        .addField('Commands', commandList.join('\n'), true)
        .addField('Info Commands', infoCommandList.join('\n'), true)
        .setTimestamp()
        .setFooter(`Commands for ${message.author.tag}`, message.author.displayAvatarURL('webp', true));
        return message.channel.send(commandEmbed);
    }}
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=commands`",
    description: "**Usage:** `=commands [command name]`\n**Description:** List commands available to you. When given the argument of a command name, gives info about that command. \"Usage:\" tells how to use the command. Arguments inside `<>` are required. Arguments inside `[]` are optional. \"Description:\" gives a discription of the command and what it does. \"Requirements:\" gives the requirements necesary to execute the command. \n**Requirements:** none" 
}};

exports.permLevel = 0;
exports.name = 'commands';