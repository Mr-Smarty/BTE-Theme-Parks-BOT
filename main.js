const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require('mysql');

const config = require("./config.json");
const ids = require("./ids.json");
const info = require("./info.json");

const ping = require("minecraft-server-util");

client.on("ready", () => {
    console.log("BTE: Theme Parks BOT is online!");
    client.user.setActivity('for =help', { type: 'WATCHING'})
    .then(console.log)
    .catch(console.error);
});

const prefix = config.prefix;

client.on("message", (message) => {

    if (message.author.id === '565177091361079296'){
        message.react('728634297174720602')
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.name == undefined) return;
    
    if (command === 'ping') {
        message.channel.send("pong!"); 
    } else
    if (command === 'smarty') {
        message.channel.send("The best staff. ~~2nd to Adam~~");
    } else
    if (command === 'devcommand' && message.author.id == config.ownerID) {
        message.channel.send("dev");
    } else
    if (command === 'admincommand' && message.member.roles.cache.has(ids.adminRoleID)) {
        message.channel.send("admin");
    } else
    if (command === 'modcommand' && message.member.roles.cache.has(ids.modRoleID)) {
        message.channel.send("mod");
    } else
    if (command === 'modcommand' && message.member.roles.cache.has(ids.trialModRoleID)) {
        message.channel.send("mod");
    } else
    if (command === 'server') {
        ping('74.99.66.137', 25565, (error, response) => {
            if (error) {
                const errorEmbed = new Discord.MessageEmbed()
                .setTitle('Server Status')
                .setColor(info.embedHexcode)
                .setDescription('Offline :pensive: Contact Cdub#5909')
                .setTimestamp()
                message.channel.send(errorEmbed);   
                return;        
            }
            
            const serverEmbed = new Discord.MessageEmbed()
            .setTitle('Server Status')
            .setColor(info.embedHexcode)
            .setDescription('Online! :thumbsup:')
            .addField('Server IP', response.host)
            .addField('Server Version', response.version)
            .addField('Online Players', response.onlinePlayers + '\n' + '\n Use `=players` to view online players')
            .addField('Server Description', response.descriptionText)
            .setTimestamp()
            message.channel.send(serverEmbed);
         
            console.log(response);
        });
    } else
    if (command === 'commands' && message.author.id == config.ownerID) {
        const commandEmbed = new Discord.MessageEmbed()
        .setTitle("Available Commands: `DEV`")
        .setColor(info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=commands** \n **=modSay** \n **=devCommand** (TEST) \n **=modCommand** (TEST)')
        .setTimestamp(info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (command === 'commands' && message.member.roles.cache.has(ids.adminRoleID)) {
        const commandEmbed = new Discord.MessageEmbed()
        .setTitle("Available Commands: `ADMIN`")
        .setColor(info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=commands** \n **=modSay** \n **=adminCommand** (TEST) \n **=modCommand** (TEST)')
        .setTimestamp(info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (command === 'commands' && (message.member.roles.cache.has(ids.modRoleID))) {
        const commandEmbed = new Discord.MessageEmbed()
        .setTitle("Available Commands: `MOD`")
        .setColor(info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=commands** \n **=modSay** \n **=modCommand** (TEST)')
        .setTimestamp(info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (command === 'commands' && (message.member.roles.cache.has(ids.trialModRoleID))) {
        const commandEmbed = new Discord.MessageEmbed()
        .setTitle("Available Commands: `TRIAL MOD`")
        .setColor(info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=commands** \n **=modSay** \n **=modCommand** (TEST)')
        .setTimestamp(info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", info.devIconLink)
        message.channel.send(commandEmbed);
        return;
    } else
    if (command === 'commands') {
        const commandEmbed = new Discord.MessageEmbed()
        .setTitle("Available Commands")
        .setColor(info.embedHexcode)
        .setDescription('**=ping** \n **=server** \n > **=players** \n **=commands**')
        .setTimestamp(info.commandUpdate)
        .setFooter("Last updated by MrSmarty#1732", info.devIconLink)
        message.channel.send(commandEmbed);
    } else
    if (command === 'players') {
        ping('74.99.66.137', 25565, (error, response) => {
            if (error) {
                const errorEmbed = new Discord.MessageEmbed()
                .setTitle('Server Status')
                .setColor(info.embedHexcode)
                .setDescription('Offline :pensive: Contact Cdub#5909')
                .setTimestamp()
                message.channel.send(errorEmbed);
                return;
            }
            
            if (response.samplePlayers === null) {
                if (response.onlinePlayers === 0) {
                    const noPlayerEmbed = new Discord.MessageEmbed()
                    .setTitle('Online Players')
                    .setColor(info.embedHexcode)
                    .setDescription('No players are online :confused:')
                    .setTimestamp()
                    message.channel.send(noPlayerEmbed);  
                } else {
                    const manyPlayersEmbed = new Discord.MessageEmbed()
                    .setTitle('Online Players')
                    .setColor(info.embedHexcode)
                    .setDescription("There's too many players to list! :open_mouth:")
                    .setTimestamp()
                    message.channel.send(manyPlayersEmbed);
                }
            } else {
                let players = [];
                let x = 0;
                let max = response.samplePlayers.length;

                while ((x + 1) <= max) {
                    players[x] = response.samplePlayers[x].name;
                    x++;
                }
                console.log(players)

                const playerEmbed = new Discord.MessageEmbed()
                .setTitle('Online Players')
                .setColor(info.embedHexcode)
                .setDescription(players)
                .setTimestamp()
                message.channel.send(playerEmbed);
            }
            
            console.log(response);
        });
    } else
    if (command === 'modsay' && message.member.roles.cache.has(ids.modRoleID)) {
        if (!message.mentions.channels.first()) {
            message.channel.send('Please mention a channel.');
            return;
        }
        let channel = message.mentions.channels.first();
        let userMessage = args.slice(1).join(" ");
        if (!userMessage) {
            message.channel.send('Please enter a message');
            return;
        }
        console.log(userMessage + '\n' + channel);
        channel.send(userMessage);
        message.react('✅');
    } else
    if (command === 'modsay' && message.member.roles.cache.has(ids.trialModRoleID)) {
        if (!message.mentions.channels.first()) {
            message.channel.send('Please mention a channel.');
            return;
        }
        let channel = message.mentions.channels.first();
        let userMessage = args.slice(1).join(" ");
        if (!userMessage) {
            message.channel.send('Please enter a message');
            return;
        }
        console.log(userMessage + '\n' + channel);
        channel.send(userMessage);
        message.react('✅');
    } 
});
 
client.login(config.token);