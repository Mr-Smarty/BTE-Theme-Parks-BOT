exports.run = async (client, message, args) => {
    if(message.author.id !== client.config.ownerID) return;

    try {
        const code = args.join(" ");
        let response = eval(code);
        Promise.resolve(response).then(() => message.react('✅')).catch(err => {
            message.channel.send(`Error executing code:\n\`\`\`${err}\`\`\``);
            message.react('❌');
        })
    } catch (err) {
        message.channel.send(`Error executing code:\n\`\`\`${err}\`\`\``);
        message.react('❌');
    }
}

exports.help = {embed: {  
    color: "#60b0f4",
    title: "Commands: `=eval`",
    description: "**Usage:** `=eval <javascript function, method, or statement>` \n**Description:** Executes specified code, method, or statement. \n**Requirements:** Be the bot developer \\:|"  
}};

exports.permLevel = -1
exports.name = 'eval';