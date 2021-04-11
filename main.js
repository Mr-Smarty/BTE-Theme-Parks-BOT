console.log("\x1b[0m", 'starting...');

const Discord = require("discord.js");
const fs = require('fs');
const ping = require("minecraft-server-util");
const Enmap = require("enmap");
const googleSpreadsheet = require('google-spreadsheet');
const fetch = require('node-fetch');
const { promisify } = require('util');

const config = require('./infoJsons/config.json');
const ids = require('./infoJsons/ids.json');
const info = require('./infoJsons/info.json');
const creds = require('./infoJsons/client_secret.json');

const autoApp = require('./helpers/autoApp.js');
const verify = require('./helpers/verify.js');
const sendLog = require('./helpers/sendLog.js');
const Park = require('./helpers/Park/Park.js');

const client = new Discord.Client({ partials : ["MESSAGE", "CHANNEL", "REACTION"]});
const prefix = config.prefix;

client.Park = Park;
client.responses = new Enmap({name: "responses"});
client.scores = new Enmap({name: "scores"});
client.Discord = Discord;
client.ping = ping;
client.googleSpreadsheet = googleSpreadsheet;
client.fetch = fetch;
client.promisify = promisify;
client.lastRestart = new Enmap({name: "lastRestart"});
client.updateCooldowns = new Enmap({name: "updateCooldowns"});
client.config = config;
client.ids = ids;
client.info = info;
client.creds = creds;
client.autoApp = autoApp;
client.verify = verify;
client.sendLog = sendLog;
client.prefix = prefix;
client.commands = new Enmap();
client.accessSpreadsheet = accessSpreadsheet;

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

setInterval(() => {
    let now = new Date();
    if (now.getMinutes() == 0 && now.getHours() == 20) client.updateCooldowns.clear();
}, 60000)

client.on("ready", () => {
    console.log("BTE: Theme Parks BOT is online!");
    client.user.setActivity('for =help', { type: 'WATCHING'})
    .then(console.log('Status set.'))
    .catch(console.error);
    client.lastRestart.ensure('id', '0')
    if (client.lastRestart.get('id') !== '0') {
        const server = client.guilds.cache.get('704350087739867208');
        const channel = server.channels.cache.get('704382150450872430')
        channel.messages.fetch(client.lastRestart.get('id')).then(message => {
            message.edit('Bot restarted! :white_check_mark:')
        })
    }
    client.lastRestart.clear();
    client.guilds.cache.get('704350087739867208').members.fetch().then(members => console.log(`Cached ${members.size} members.`))

    function serialize(data) {
        return {
            ...data,
            _role: data._role ? data._role.id : undefined,
            _channel: data._channel ? data._channel.id : undefined,
            _pinMessage: data._pinMessage ? data._pinMessage.id : undefined,
        }
    }
    function deserialize(data) {
        let obj = {
            ...data,
            _role: data._role ? client.guilds.cache.get(ids.guildID).roles.cache.get(data._role) : undefined,
            _channel: data._channel ? client.channels.cache.get(data._channel) : undefined,
        }
        obj._pinMessage && obj._channel ? obj._channel.messages.fetch(data._pinMessage).then(msg => obj._pinMessage = msg) : undefined;
        return Object.setPrototypeOf(obj, client.Park.prototype);
    }

    client.parks = new Enmap({
        name: "parks",
        serializer: serialize,
        deserializer: deserialize
    });
});

process.on('unhandledRejection', async err => {
    let sendLog = require('./helpers/sendLog.js');
    try {
        sendLog.run(client, client.user, 'Unhandled Promise Rejection', `\`\`\`\n${err.stack}\n\`\`\``, null, null, 'NEGATIVE')
    } catch(e) {}
})

client.login(config.token).catch(err => console.error("\x1b[31m", 'ERROR CONNECTING TO DISCORD:\n' + err + '\n Fix connection and restart.'));