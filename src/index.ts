import 'reflect-metadata';
import Discord from 'discord.js';
import config from '../config.json';
import Client from './struct/client';

const client = new Client(config);

client.on('message', (message: Discord.Message) => {
    if (message.content.toLowerCase().trim() == 't=ping') message.channel.send('pong!');
});

client.login(client.config.token);
