exports.run = async (client, message, args) => {
    if(message.author.id !== client.config.ownerID) return;

    var status;
    try {
        const code = args.join(" ");
        let response = eval(code);
        await Promise.resolve(response).then(res => {
            message.react('✅'), message.channel.send({embed: {title: 'Response:', color: client.info.embedHexcode, description: String(res) || "\u200b"}})
            status = 'Success';
        }).catch(err => {
            message.react('❌'), message.channel.send(`Error executing code:\n\`\`\`${err}\`\`\``)
            status = 'Failed';
        });
    } catch (err) {
        await message.channel.send(`Error executing code:\n\`\`\`${err}\`\`\``);
        await message.react('❌');
        status = 'Failed';
    } finally {
        client.sendLog.run(client, message.author, undefined, `<@!${message.author.id}>** (${message.author.tag}) attempted to eval the following code:**\n\`\`\`${args.join(" ")}\`\`\`\n[Click here for context.](${message.url})`, null, {"Author ID": message.author.id, Outcome: status});
    }
}

exports.help = {embed: {  
    color: "#60b0f4",
    title: "Commands: `=eval`",
    description: "**Usage:** `=eval <javascript function, method, or statement>` \n**Description:** Executes specified code, method, or statement. \n**Requirements:** Be the bot developer \\:|"  
}};

exports.permLevel = -1
exports.name = 'eval';