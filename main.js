const Discord = require("discord.js");
const client = new Discord.Client({ partials : ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require('fs');
const ping = require("minecraft-server-util");
const Enmap = require("enmap");

console.log('starting...')

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

client.Discord = Discord;
client.ping = ping;

const config = require("./config.json");
client.config = config;
const ids = require("./ids.json");
client.ids = ids;
const info = require("./info.json");
client.info = info;

const prefix = config.prefix;
client.prefix = prefix;

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.on("ready", () => {
    console.log("BTE: Theme Parks BOT is online!");
    client.user.setActivity('for =help', { type: 'WATCHING'})
    .then(console.log)
    .catch(console.error);
});

client.on('messageReactionAdd', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();

     if (user.bot) return;
     if (!reaction.message.guild) return;

     if (reaction.message.channel.id === '749302258239275069' && reaction.emoji.name === '✅') {
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
         } else
         if (reaction.emoji.id === '749407387709997056') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('749407113117171882')
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
         } else
         if (reaction.emoji.id === '749407387709997056') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('749407113117171882')
         }
     }
})
 
client.login(config.token);