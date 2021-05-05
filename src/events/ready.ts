import Client from '../struct/client';

export default async function (this: Client): Promise<unknown> {
    return console.log('ready!');
}
