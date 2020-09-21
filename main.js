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
 
client.login(config.token);