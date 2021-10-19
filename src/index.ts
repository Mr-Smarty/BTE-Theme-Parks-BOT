console.log('\x1b[0m' + 'Starting...');

import 'reflect-metadata';
import Client from './struct/Client';
const config = require('../config.json');

const client = new Client(config);

async function main() {
    console.log('\n\x1b[0m' + 'Loading events...');
    await client.loadEvents();
    console.log('\x1b[32m' + 'Events loaded');

    console.log('\n\x1b[0m' + 'Loading commands...');
    await client.loadCommands();
    console.log('\x1b[32m' + 'Commands loaded');

    console.log('\n\x1b[0m' + 'Connecting to database...');
    await client.initDatabase();
    console.log('\x1b[32m' + 'Database connected');

    console.log('\n\x1b[0m' + 'Starting progress update cooldown cycle...');
    client.cooldownCycle();
    console.log('\x1b[32m' + 'Progress update cooldown cycle started');

    console.log('\n\x1b[0m' + 'Logging in...');
    await client.login(client.config.token);
    console.log('\x1b[32m' + 'Client logged in\n' + '\x1b[0m');
}

main().catch(err => {
    console.error('\n\x1b[0m' + err.stack || err);
    process.exit(1);
});

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
