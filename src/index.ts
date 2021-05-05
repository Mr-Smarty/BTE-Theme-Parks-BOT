import 'reflect-metadata';
import config from '../config.json';
import Client from './struct/client';

const client = new Client(config);

client.loadEvents();
client.loadCommands();

client.login(client.config.token);
