const Discord = require("discord.js");
const client = new Discord.Client({ partials : ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require('fs');

const config = require("./config.json");

console.log('starting...')

const ids = require("./ids.json");
const info = require("./info.json");

const ping = require("minecraft-server-util");

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}

client.on("ready", () => {
    console.log("BTE: Theme Parks BOT is online!");
    client.user.setActivity('for =help', { type: 'WATCHING'})
    .then(console.log)
    .catch(console.error);
});

const prefix = config.prefix;

client.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.author.id === '565177091361079296') {
        message.react('728634297174720602')
    }

    if (message.author.bot) return;
    
    if (message.channel.id !== '715017068772196424') {
        if (!message.content.startsWith(prefix)) return;
    }

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
    } else 
    if (message.channel.id === '715017068772196424') {
        message.react('730466277390417930')
        .then(() => message.react('🤷‍♂️'))
        .then(() => message.react('730466352430579813'))
        .catch(() => console.error('One of the emojis failed to react.'));
    } else
    if (command === 'reactions' && message.channel.id === '717832342550610113') {
        const reactionMessage = '**__Reaction Role Menu__** \nReact below to get your park roles. \n\n' + info.emojis.AltonTowers + ' : `Alton Towers` \n\n:lion_face: : `Busch Gardens Tampa` \n\n' + info.emojis.Busch + ' : `Busch Gardens Williamsburg` \n\n' + info.emojis.Carowinds + ' : `Carowinds` \n\n:horse: : `Chessington: World of Adventures` \n\n:chocolate_bar: : `Hershey Park` \n\n:crown: : `Kings Dominion` \n\n:sailboat: : `PortAventura World` \n\n:whale: : `SeaWorld Orlando` \n\n' + info.emojis.SixFlags + ' : `Six Flags Great Adventure` \n'
        
        let msg = await message.channel.send(reactionMessage);
        msg.react('705550277339644017')
        .then(() => msg.react('🦁'))
        .then(() => msg.react('717839235788439572'))
        .then(() => msg.react('748790956979126292'))
        .then(() => msg.react('🐴'))
        .then(() => msg.react('🍫'))
        .then(() => msg.react('👑'))
        .then(() => msg.react('⛵'))
        .then(() => msg.react('🐋'))
        .then(() => msg.react('731224218598899843'))
        .catch(() => console.error('One of the emojis failed to react.'));
    } else
    if (command === 'req') {
        const userId = message.author.id
        jsonReader('./scores.json', (err, score) => {
            if (err) {
                console.log(err)
                return
            }
            if (score[userId]) {
                const scoreInt = score[userId]
                message.channel.send(`Score for <@${userId}>: \`${scoreInt}\``)
            } else {
                message.channel.send(`Score for <@${userId}>: \`0\``)
            }
        })
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();

     if (user.bot) return;
     if (!reaction.message.guild) return;

     if (reaction.message.channel.id === '718967630169505883' && reaction.emoji.name === '✅') {
         const userId = await reaction.message.author.id
         jsonReader('./scores.json', (err, test) => {
            if (err) {
                console.log(err)
                return
            }
            
            if (!test[userId]) {
                test[userId] = 1
                fs.writeFile('./scores.json', JSON.stringify(test, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                    console.log(test)
                })
            } else {
                test[userId] += 1
        
                fs.writeFile('./scores.json', JSON.stringify(test, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                    console.log(test)
                })
            }
         })

         reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
         .then(() => reaction.message.react('☑️'))
     } else

     if (reaction.message.channel.id === '717832342550610113') {
         if (reaction.emoji.id === '705550277339644017') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950515470925835')
         } else
         if (reaction.emoji.name === '🦁') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('740307771085422672')
         } else
         if (reaction.emoji.id === '717839235788439572') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951008436125856')
         } else
         if (reaction.emoji.id === '748790956979126292') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('744380828464840835')
         } else
         if (reaction.emoji.name === '🐴') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951457570324491')
         } else
         if (reaction.emoji.name === '🍫') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('715301522526699602')
         } else
         if (reaction.emoji.name === '👑') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('713431350027485284')
         } else
         if (reaction.emoji.name === '⛵') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950648862638161')
         } else
         if (reaction.emoji.name === '🐋') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950659473965146')
         } else
         if (reaction.emoji.id === '731224218598899843') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951358459183106')
         }
     }
})

client.on('messageReactionRemove', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();

     if (user.bot) return;
     if (!reaction.message.guild) return;

     if (reaction.message.channel.id === '717832342550610113') {
         if (reaction.emoji.id === '705550277339644017') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950515470925835')
         } else
         if (reaction.emoji.name === '🦁') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('740307771085422672')
         } else
         if (reaction.emoji.id === '717839235788439572') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951008436125856')
         } else
         if (reaction.emoji.id === '748790956979126292') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('744380828464840835')
         } else
         if (reaction.emoji.name === '🐴') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951457570324491')
         } else
         if (reaction.emoji.name === '🍫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('715301522526699602')
         } else
         if (reaction.emoji.name === '👑') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('713431350027485284')
         } else
         if (reaction.emoji.name === '⛵') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950648862638161')
         } else
         if (reaction.emoji.name === '🐋') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950659473965146')
         } else
         if (reaction.emoji.id === '731224218598899843') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951358459183106')
         }
     }
})
 
client.login(config.token);

//add updates channel, change reaction channel id