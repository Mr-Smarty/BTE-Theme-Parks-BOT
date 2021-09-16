import { Message, MessageEmbed, Util } from 'discord.js';
import Client from '../struct/client';
import Command from '../struct/Command';
import { status, statusBedrock } from 'minecraft-server-util';

export default new Command({
    name: 'server',
    aliases: ['players', 'online'],
    description: 'Check the status of the team Minecraft server',
    permission: ['any'],
    usage: null,
    async run(this: Command, _client: Client, message: Message, args: string[]) {
        let msg = await message.channel.send('Checking systems...');

        let responses = await Promise.allSettled([
            status(_client.config.server.IP, { port: _client.config.server.port }),
            status(_client.config.server.network.java),
            statusBedrock(_client.config.server.network.bedrock)
        ]);

        let teamServer = {
            online: responses[0].status == 'fulfilled',
            status: responses[0].status == 'fulfilled' ? 'Online ✅' : 'Offline ❌',
            res: responses[0].status == 'fulfilled' ? responses[0].value : undefined
        };
        let network = {
            online: responses[1].status == 'fulfilled',
            status: responses[1].status == 'fulfilled' ? 'Online ✅' : 'Offline ❌',
            res: responses[1].status == 'fulfilled' ? responses[1].value : undefined
        };
        let bedrock = {
            online: responses[2].status == 'fulfilled',
            status: responses[2].status == 'fulfilled' ? 'Online ✅' : 'Offline ❌',
            res: responses[2].status == 'fulfilled' ? responses[2].value : undefined
        };

        let response = new MessageEmbed({
            title: 'Systems Status',
            description: `Team Server: ${teamServer.status}\nNetwork (Java): ${network.status}\nNetwork (Bedrock): ${bedrock.status}`,
            color: _client.config.colors.standard,
            timestamp: new Date()
        });

        if (teamServer.online)
            response.addField(
                'Team Server',
                `\`\`\`${Util.escapeCodeBlock(
                    teamServer.res.description.toRaw()
                )}\`\`\`\n${teamServer.res.onlinePlayers} / ${
                    teamServer.res.maxPlayers
                } players online\n${
                    teamServer.res.samplePlayers
                        ?.map(player => `- \`${player.name}\``)
                        .join('\n') || ''
                }`
            );

        if (network.online) {
            let players = network.res.samplePlayers;

            let index = players.findIndex(player =>
                player.name.includes('----------------------')
            );
            let lobby = /[^§.](?<number>\d+)/.exec(players[index + 1].name).groups.number;
            let build = /[^§.](?<number>\d+)/.exec(players[index + 2].name).groups.number;
            let teams = /[^§.](?<number>\d+)/.exec(players[index + 3].name).groups.number;

            response.addField(
                'BuildTheEarth Network',
                `\`\`\`${Util.escapeCodeBlock(
                    network.res.description.toRaw()
                )}\`\`\`\nIP: \`${network.res.host}\`\nPort: \`${network.res.port}\`\n${
                    network.res.onlinePlayers
                } / ${
                    network.res.maxPlayers
                } players online\n- ${lobby} are in the lobby\n- ${build} are in building\n- ${teams} are in team servers`
            );
        }

        if (bedrock.online)
            response.addField(
                'Bedrock Proxy',
                `The Bedrock proxy is online!\nIP/Server Address: \`${bedrock.res.host}\`\nPort: \`${bedrock.res.port}\``
            );

        msg.edit({
            content: null,
            embeds: [response]
        });
    }
});
