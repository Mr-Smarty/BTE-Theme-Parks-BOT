exports.run = (client, message, args) => {
    if (!args || args.length < 1) {
        const embed = new client.Discord.MessageEmbed()
        .setTitle('BuildTheEarth Theme Parks: Help')
        .setColor(client.info.embedHexcode)
        .setThumbnail('https://images-ext-1.discordapp.net/external/PmiQn1CRhOs7fO1gh4t5AgduvuPjgQAJCicYQWHfku4/%3Fsize%3D128/https/cdn.discordapp.com/icons/704350087739867208/30a3ff8e2f0eb5df722c6d6fe3607892.png')
        .setDescription('Waiting for Adam to give me a short, simple discription. :eyes: For now you\'ll get a rainbow blob: <a:RainbowBlob:753714356939784202>')
        .addField('Use a command below to get more specific information:', '`=help apply` \n`=help progress-updates` \n`=help server`');
        return message.channel.send(embed);
    }
    if (args[0] == 'progress' || args[0] == 'progress-update' || args[0] == 'progress-updates') args[0] = 'score';
    if (args[0] == 'ip') args[0] = 'server';
    switch (args[0]) {
        case 'apply': {
            if (args[1] === 'reviewer') {
                const embed = new client.Discord.MessageEmbed()
                .setTitle('Help: Managing Applications')
                .setColor(client.info.embedHexcode)
                .setDescription(`Only Moderation roles and above can review and manage builder application. \n
                All the application information is stored in a Google Sheet only accessible by AdamW#0451 and the developer. \n
                Each application can have 3 statuses: TRUE, FALSE, or undefined. Unreviewed applications have an undefined status. Reviewed applications either have a TRUE status for accepted or a FALSE status for denied. \n
                Note that each application command that gets application data or updates it will take a few seconds. Trying to run an application multiple times before a result is given could cause problems. \n
                Each application also has an ID. An application's ID is equal to its row number in the google sheet - 1 to account for the header row. You can get information for a specific application by using its ID. \n
                Accepting an application will give the applicant the builder role, granting them building permissions and send a DM. Denying an application will only set the status to FALSE, and send the user a DM with the denial reason. You can only accept and deny applications that are unreviewed. \n
                Use \`=commands app\` to see all the commands and their usage for reviewing, accepting, denying, listing, and viewing application.`)
                return message.channel.send(embed);
            }
            const embed = new client.Discord.MessageEmbed()
            .setTitle('Help: Applying for the Team')
            .setColor(client.info.embedHexcode)
            .setDescription(`Thanks for showing interest in becoming a builder for our team! \nWe have a very simple 2-step process, and then you can start building! \n\n **Step 1:** Apply for the team [here](https://buildtheearth.net/buildteams/121/join). Wait for an acceptance DM from the BTE Bot \n
            **Step 2:** Build 3 buildings in minecraft 1.12.2 or in the BTE modpack with the scale 1:1. *1 meter = 1 block*. If the buildings are for one of our projects, or you would like them to be part of a future project, we can transfer them to the server after. Fill out the form [here](https://forms.gle/BwuKuUx6QNvum5am8). Once accepted, you will get the builder role in the discord server. If you don't get builder permissions in the team Minecraft server, use \`/discord link\``)
            message.channel.send(embed); 
            }
            break;
        case 'score': {
            const embed = new client.Discord.MessageEmbed()
            .setTitle('Help: Progress-Updates Score System')
            .setColor(client.info.embedHexcode)
            .setDescription(`The Progress-Updates point system's purpose is to give active, skilled builders rewards for their work.`)
            .addField('How it Works:', 'Any builder can post an progress update in <#749302258239275069>. Anything other than an update will result in a warn. Once a staff member checks off on your update by reacting with a :white_check_mark:, you get a point which is confirmed with a :ballot_box_with_check: reaction. You can view your score by using the command `=score`. To level up, you must use this command. you will not level up automatically.')
            .addField('Levels:', `<@&${client.ids.level1}> 2 points \n<@&${client.ids.level2}> 4 points \n<@&${client.ids.level3}> 6 points \n<@&${client.ids.level4}> 8 points \n<@&${client.ids.level5}> 10 points \n<@&${client.ids.level6}> 15 points \n<@&${client.ids.sBuilder}> 20 points`)
            .addField('Rewards:', '**Level 1:** Post in <#704355790127104010> \n**Level 2:** Post attachments and link embeds in <#704350088843100160> and <#709971609389105244> \n**Level 5:** Access to <#749376102299861052> \n**Level 6:** Place your head in the Hall of Fame on the BTE: Theme Parks server \n**Senior Builder**')
            .addField('Format:', `\`\`\`1. What I did \n2. What I plan to do\`\`\``)
            .setImage('https://media.discordapp.net/attachments/712767931171209257/758859868886138890/Untitled.png?width=1089&height=612')
            message.channel.send(embed);
            }
            break;
        case 'server': {
            const embed = new client.Discord.MessageEmbed()
            .setTitle('BTE: Theme Parks Server')
            .setColor(client.info.embedHexcode)
            .setDescription('**IP:** `themeparks.wither.host:25650` \nFor more information, go to <#709111575197384734>. \nTo check the server\'s status, use the command `=server` or go to <#749346984623734875>.')
            message.channel.send(embed);
            }
            break;
        default:
            const embed = new client.Discord.MessageEmbed()
            .setTitle('BuildTheEarth Theme Parks: Help')
            .setColor(client.info.embedHexcode)
            .setThumbnail('https://images-ext-1.discordapp.net/external/PmiQn1CRhOs7fO1gh4t5AgduvuPjgQAJCicYQWHfku4/%3Fsize%3D128/https/cdn.discordapp.com/icons/704350087739867208/30a3ff8e2f0eb5df722c6d6fe3607892.png')
            .setDescription('Waiting for Adam to give me a short, simple discription. :eyes: For now you\'ll get a rainbow blob: <a:RainbowBlob:753714356939784202>')
            .addField('Use a command below to get more specific information:', '`=help apply` \n`=help progress-updates` \n`=help server`');
            return message.channel.send(embed);
    }
}