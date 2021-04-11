module.exports.run = async(client, message, args) =>
{
    console.log('args:', args)
    const targetUserId = args[0].substr(3,18)
    const {guild} = message
    const member = guild.members.cache.get(targetUserId)
    if(!targetUserId)
    {
        message.reply(`Please specify someone to grant a role.`)
        return
    }
    const roleName = args[1]
    const role = guild.roles.cache.find((role) =>
    {
        return role.name === roleName
    })
    if(!role)
    {
        message.reply(`Please specify a verified role to grant.`)
        return
    }
    member.roles.add(role)
    message.reply(`<@${member.id}> now has the ${role} role`)
}