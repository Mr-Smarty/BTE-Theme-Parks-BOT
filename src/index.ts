import 'reflect-metadata';
import config from '../config.json';
import Client from './struct/client';

const client = new Client(config);

client.loadEvents();
client.loadCommands();

process.on('unhandledRejection', async (err: Error) => {
    try {
        client.sendLog({
            user: client.user,
            title: 'Unhandled Promise Rejection',
            description: `\`\`\`\n${err.stack}\n\`\`\``,
            type: 'NEGATIVE'
        });
    } catch (e) {}
});

client.login(client.config.token);
