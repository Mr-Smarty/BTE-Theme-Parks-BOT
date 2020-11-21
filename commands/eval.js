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