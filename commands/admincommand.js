exports.run = (client, message, args) => {
    if(!message.member.roles.cache.has(client.ids.adminRoleID)) return;
    message.channel.send("admin").catch(console.error);
};