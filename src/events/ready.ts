import { ClientInfo } from '../entity/ClientInfo';
import Client from '../struct/client';

export default async function (this: Client): Promise<unknown> {
    console.log('\x1b[42m\x1b[30m' + 'ready!' + '\x1b[0m\n');

    this.user.setActivity(`for ${this.config.prefix}help`, { type: 'WATCHING' });
    console.log('Status set');

    let members = await this.guilds.cache.get(this.config.ids.guild).members.fetch();
    console.log(`Fetched and cached ${members.size} members`);

    const restartMsg = await this.db.manager.findOne(ClientInfo);
    if (restartMsg) restartMsg.restart(this);

    return;
}
