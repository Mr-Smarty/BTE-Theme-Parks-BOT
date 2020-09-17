const Discord = require("discord.js");
const client = new Discord.Client({ partials : ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require('fs');
const ping = require("minecraft-server-util");
const Enmap = require("enmap");
const googleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

console.log('starting...');

client.Discord = Discord;
client.ping = ping;
client.googleSpreadsheet = googleSpreadsheet;
client.promisify = promisify;

const config = require('./infoJsons/config.json');
client.config = config;
const ids = require('./infoJsons/ids.json');
client.ids = ids;
const info = require('./infoJsons/info.json');
client.info = info;
const creds = require('./infoJsons/client_secret.json');
client.creds = creds;
const commandEmbeds = require('./infoJsons/commandEmbeds.json');
client.commandEmbeds = commandEmbeds;
const autoApp = require('./autoApp.js');
client.autoApp = autoApp;

const prefix = config.prefix;
client.prefix = prefix;

function jsonReader(filePath, cb) {
   fs.readFile(filePath, (err, fileData) => {
       if (err) {
           return cb && cb(err);
       }
       try {
           const object = JSON.parse(fileData);
           return cb && cb(null, object);
       } catch(err) {
           return cb && cb(err);
       }
   });
}

async function accessSpreadsheet(google, credentials) {
   const doc = new google.GoogleSpreadsheet('1zcJgw_hUiewoMU8wDslTMHNdt-PvIuUJwfsMyH5E1Ho');
   await doc.useServiceAccountAuth({
         client_email: credentials.client_email,
         private_key: credentials.private_key,
      });
   
   await doc.loadInfo();
   const sheet = doc.sheetsByIndex[0];
   return sheet;
}

client.accessSpreadsheet = accessSpreadsheet;

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
         const userId = await reaction.message.author.id;
         jsonReader('./scores.json', (err, test) => {
            if (err) {
                console.log(err);
                return;
            }
            
            if (!test[userId]) {
                test[userId] = 1;
                fs.writeFile('./scores.json', JSON.stringify(test, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                    console.log(test);
                });
            } else {
                test[userId] += 1;
        
                fs.writeFile('./scores.json', JSON.stringify(test, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                    console.log(test);
                });
            }
         });

         reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))
         .then(() => reaction.message.react('☑️'));
     } else

     if (reaction.message.channel.id === '717832342550610113') {
         if (reaction.emoji.id === '705550277339644017') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950515470925835');
         } else
         if (reaction.emoji.name === '🦁') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('740307771085422672');
         } else
         if (reaction.emoji.id === '717839235788439572') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951008436125856');
         } else
         if (reaction.emoji.id === '748790956979126292') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('744380828464840835');
         } else
         if (reaction.emoji.name === '🐴') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951457570324491');
         } else
         if (reaction.emoji.name === '🍫') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('715301522526699602');
         } else
         if (reaction.emoji.name === '👑') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('713431350027485284');
         } else
         if (reaction.emoji.name === '⛵') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950648862638161');
         } else
         if (reaction.emoji.name === '🐋') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709950659473965146');
         } else
         if (reaction.emoji.id === '731224218598899843') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('709951358459183106');
         } else
         if (reaction.emoji.id === '749407387709997056') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('749407113117171882');
         }
     }
});

client.on('messageReactionRemove', async (reaction, user) => {
     if (reaction.message.partial) await reaction.message.fetch();
     if (reaction.partial) await reaction.fetch();

     if (user.bot) return;
     if (!reaction.message.guild) return;

     if (reaction.message.channel.id === '717832342550610113') {
         if (reaction.emoji.id === '705550277339644017') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950515470925835');
         } else
         if (reaction.emoji.name === '🦁') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('740307771085422672');
         } else
         if (reaction.emoji.id === '717839235788439572') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951008436125856');
         } else
         if (reaction.emoji.id === '748790956979126292') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('744380828464840835');
         } else
         if (reaction.emoji.name === '🐴') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951457570324491');
         } else
         if (reaction.emoji.name === '🍫') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('715301522526699602');
         } else
         if (reaction.emoji.name === '👑') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('713431350027485284');
         } else
         if (reaction.emoji.name === '⛵') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950648862638161');
         } else
         if (reaction.emoji.name === '🐋') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709950659473965146');
         } else
         if (reaction.emoji.id === '731224218598899843') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('709951358459183106');
         } else
         if (reaction.emoji.id === '749407387709997056') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('749407113117171882');
         }
     }
});

client.on("guildMemberRemove", async function(member){
   const user = member.user
   sheet = await client.accessSpreadsheet(client.googleSpreadsheet, client.creds);
   const rows = await sheet.getRows({
        offset: 0
   });
   let filledRows = await rows.map(r => {
      if (r.Timestamp !== 'undefined') return r
      else return;
   });
   const rowCount = await filledRows.length;
   let apps = [];
   for (let i = 0; i < rowCount; i++) {
      if (filledRows[i].Username == user.tag) {
         if (!filledRows[i].result) apps.push(i);
      }
   }
   if (apps.length == 0) return
   else {
      apps.forEach(async r => {
         rows[r].result = false;
         await rows[r].save();
      });
      client.channels.cache.get('739239527431798805').send(`**${user.tag}** has left the server. Any unreviewed applications denied.`);
   }
});
 
client.login(config.token);