var extraMessage = '**In order to actually build in these parks, you need to have the __Builder__ role in this discord server. If you are a Builder and would like to build in the __Universal Orlando Resort__ or __Disneyland Resort__, you can find more information by viewing their respective channels.**\nClick a reaction once to add a role and again to remove it.'
var extraMessage2 = '​\nIf you would like to build in any of these existing projects, you are more than welcome to - many of them are still under construction! Please ask a member of our staff team for details.\n**Most parks have their own park-specific channels - if you would like to view the channel for your park, click the reactions in <#717832342550610113>.**'

exports.run = (client, message, args) => {
    let start = new Date();

    if(!message.member.roles.cache.has(client.ids.adminRoleID)) return message.channel.send('Only an admin can create a new team project.');

    args = args.join(" ").split(/ +\| +/g);
    if(args.length !== 6) return message.channel.send('This command takes 6 arguments seperated by ` | `! Use `=commands newProject` for more info.');

    let options = {};
    var name;

    args[0] = args[0].replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');
    if(args[0].length < 2 || args[0].length > 31) return message.channel.send('The project name must be between 2 and 31 characters inclusive. Emojis will be removed.');
    else name = args[0];

    if(args[1].toLowerCase() == 'true' || args[1].toLowerCase() == 'false') {
        if(args[1].toLowerCase() == 'true') options.hasReactionRole = true;
        else options.hasReactionRole = false;
    } else return message.channel.send('The second argument for whether or not the project has a reaction role must be `true` or `false`.');

    if(args[2].toLowerCase() == 'true' || args[2].toLowerCase() == 'false') {
        if(args[2].toLowerCase() == 'true') options.hasChannel = true;
        else options.hasChannel = false;
    } else return message.channel.send('The third argument for whether or not the project has a Discord channel must be `true` or `false`.');

    switch(args[3].toLowerCase()) {
        case 'role':
            options.visibility = 'toRole';
            break;
        case 'all':
            options.visibility = 'toAll';
            break;
        case 'private':
            options.visibility = 'private';
            break;
        default:
            return message.channel.send('The fourth argument for channel visibility must be given no matter what. Its options are `role`, `all`, or `private`.');
    }

    if(args[4].toLowerCase() == 'true' || args[4].toLowerCase() == 'false') {
        if(args[4].toLowerCase() == 'true') options.hidden = true;
        else options.hidden = false;
    } else return message.channel.send('The fifth argument for whether or not the project is hidden on the project list must be `true` or `false`.');

    if(/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/g.test(args[5]) || /^<a?:\w{2,}:\d{18}>$/g.test(args[5])) {
        if(/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/g.test(args[5])) options.emoji = args[5];
        else if(message.guild.emojis.cache.has(args[5].match(/\d{18}/g)[0])) {
            if(message.guild.emojis.cache.get(args[5].match(/\d{18}/g)[0]).available) options.emoji = args[5];
            else message.channel.send('This emoji is not available');
        }
        else message.channel.send('This emoji is not accesible.');
    } else return message.channel.send('Please give a valid emoji for the fifth argument. If it is a custom emoji, it must be from the BTE Theme Parks Discord server.');
    if(client.parks.some(park => {return park._emoji == options.emoji;})) return message.channel.send('A project with this emoji already exists!');

    if(client.parks.indexes.map(elem => elem.toLowerCase()).includes(name.toLowerCase())) return message.channel.send('This project already exists!');
    if(client.parks.indexes.length >= 500) return message.channel.send('The max limit of 500 projects has been reached.');

    let project = new client.Park(name, options);
    project.init(client)
    .then(() => project.save(client.parks))
    .then(enmap => client.Park.reloadReactionRoles(enmap, client, extraMessage))
    .then(() => client.Park.reloadProjectList(client.parks, client, extraMessage2))
    .then(() => {
        message.react('✅');
        let elapsed = `${(new Date() - start)}ms`;
        client.sendLog.run(client, message.author, `A new project "${name}" has been created.`, `**${message.member.toString()} has created the project \`${name}\` with the following properties:**\nReaction Role?: \`${project.options.hasReactionRole}\`\n${project.options.hasChannel ? `Channel: <#${project.channel.id}>` : 'Channel?: `false`'}\nVisibility: \`${args[3].toLowerCase()}\`\nProject List Hidden?: \`${project.options.hidden}\`\nEmoji: ${project.options.emoji}`, undefined, {"Processing Time": elapsed}, 'POSITIVE');
    })
    .catch(err => {return message.channel.send(`An error occured: \n\`\`\`${err.stack || err}\`\`\``)});
}

exports.help = {embed: {
    color: "#60b0f4",
    title: "Commands: `=newProject`",
    description: "**Usage:** `=newProject <name> | <has reaction role: true OR false> | <has channel: true OR false> | <channel visibility: role OR all OR private> | <project list hidden: true OR false> | <emoji>`\n**Description:** Create a new team project with options \n**Requirements:** Admin"
}};

exports.permLevel = 5;
exports.name = 'newproject';