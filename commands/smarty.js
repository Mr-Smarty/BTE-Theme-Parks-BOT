exports.run = (client, message, args) => {
    message.channel.send("The best staff. ~~2nd to Adam~~").catch(console.error);
};

exports.help = {embed: {  
    color: "#60b0f4",
    title: "Commands: `=smarty`",
    description: "**Usage:** `=smarty` \n**Description:** ¯\\_(ツ)_/¯ \n**Requirements:** none"  
}};

exports.permLevel = 0;
exports.name = 'smarty';