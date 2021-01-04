let embedProperties = ['title', 'url', 'author', 'description', 'thumbnail', 'fields', 'image', 'footer'];

exports.run = (client, message, args) => {
    if(!message.member.roles.cache.has(client.ids.adminRoleID)) return message.channel.send('Only an admin can add commands.');
    if(!args[2]) return message.channel.send('Please specify the command name, response type, and response.');
    if(client.responses.has(args[0]) || client.commands.has(args[0].toLowerCase())) return message.channel.send('This command already exists!');

    if(args[1].toLowerCase() !== 'text' && args[1].toLowerCase() !== 'embed') return message.channel.send('Please specify the response type as text or embed.');

    let res = args.slice(2).join(" ");

    if (args[1].toLowerCase() === 'text') {
        client.responses.set(args[0].toLowerCase(), res, 'response');
        client.responses.set(args[0].toLowerCase(), false, 'isEmbed');

        message.react('✅');
        client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) created a new command:**\n\`=${args[0].toLowerCase()}\`: ${res}`, undefined, {"User ID": message.author.id}, 'POSITIVE');
    } else {
        if(!res.startsWith('{') || !res.endsWith('}')) return message.channel.send('An embed response must be input as JSON data.');
        
        var embedRes 
        try {
            embedRes = JSON.parse(res);
        } catch (e) {
            return message.channel.send(`Error parsing JSON data:\n\`\`\`${e}\`\`\``);
        }

        if(Object.keys(embedRes).length === 0) return message.channel.send('JSON cannot be empty.');

        let test = {bool: false, element: undefined};
        Object.keys(embedRes).forEach(elem => { if(!embedProperties.includes(elem)) test.bool = true, test.element = elem });
        if(test.bool) return message.channel.send(`JSON data cannot contain the key \`${test.element}\`.`);


        embedRes.color = "#60b0f4";
        client.responses.set(args[0].toLowerCase(), embedRes, 'response');
        client.responses.set(args[0].toLowerCase(), true, 'isEmbed');

        message.react('✅');
        client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}> **created a new command:**\n\`=${args[0].toLowerCase()}\` It responds with an embed.`, undefined, {"User ID": message.author.id}, 'POSITIVE');
    }
};

exports.help = {embed: {  
    color: "#60b0f4",
    title: "Commands: `=addcom`",
    description: "**Usage:** `=addCom <command name> <response type: text OR embed> <response data>` \n**Description:** Creates a new, simple call-and-response command. The response can be either plain text or an embed. If an embed, the response must be input as JSON data. Here is more info on [embeds](https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object) and [JSON](https://www.w3schools.com/js/js_json_syntax.asp). \n**Requirements:** Admin"  
}};

exports.permLevel = 5;
exports.name = 'addcom';