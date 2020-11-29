exports.run = (client, message, args) => {  
        const embed = new client.Discord.MessageEmbed()
        .setTitle('BuildTheEarth Theme Parks: Help')
        .setColor(client.info.embedHexcode)
        .setThumbnail('https://images-ext-1.discordapp.net/external/PmiQn1CRhOs7fO1gh4t5AgduvuPjgQAJCicYQWHfku4/%3Fsize%3D128/https/cdn.discordapp.com/icons/704350087739867208/30a3ff8e2f0eb5df722c6d6fe3607892.png')
        .setDescription('The BuildTheEarth: Theme Parks team is an official BuildTheEarth team that builds theme parks and resorts internationally. We are a skilled group of builders whose final goal is to complete all the theme parks and connected resorts on Earth in Minecraft. To get started, please read <#714569270356475964> and <#704382947821748244>. For the latest news, check out <#704381561092571148>. You can use `=commands` to see all other commands available to you. Never hesitate to contact a staff team member if you have any questions, and have fun!')
        .addField('Use a command below to get more specific information:', client.responses.indexes.map(elem => {return `\`=${elem}\``}).join('\n'));
        return message.channel.send(embed);
};

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=help`",
    description: "**Usage:** `=help` \n**Description:** Gives information on the team and how it functions. Lists other info commands for easy access. \n**Requirements:** none"
}};

exports.permLevel = 0;
exports.name = 'help';