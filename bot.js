require('dotenv').config();
const tokenFile = require('./admin/token');
const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs').promises;
const path = require('path');
const prefix = process.env.prefix;
client.login(tokenFile.token);
client.commands = new Map();
console.log(`SPG_bot online!`);

client.on('ready', () => 
{
    console.log(`${client.user.tag} online`);
})

client.on('message', (message) =>
{
    if(message.author.bot) return;
    let cmdName = message.content.split(" ").shift();
    console.log(cmdName);
    // if(isValidCommand(message, `hello`))
    // {
    //     message.reply(`how may i assist you?`)
    //     .catch(err => console.log(err));
    // }
    // if(isValidCommand(message, `dice`))
    // {
    //     message.reply(`${message.author.username} rolled a ${rollDice}`);
    // }
    // if(isValidCommand(message, `addrole`))
    // {
    //     let args = message.content.toLowerCase().split(` `);
    //     console.log('args:', args)
    //     args.shift();
    //     console.log(`shifted args:`, args)
    //     const targetUserId = args[0].substr(3,18)
    //     const {guild} = message
    //     const member = guild.members.cache.get(targetUserId)
    //     if(!targetUserId)
    //     {
    //         message.reply(`Please specify someone to grant a role.`)
    //         return
    //     }
    //     const roleName = args[1]
    //     const role = guild.roles.cache.find((role) =>
    //     {
    //         return role.name.toLowerCase() === roleName.toLowerCase()
    //     })
    //     if(!role)
    //     {
    //         message.reply(`Please specify a verified role to grant.`)
    //         return
    //     }
    //     //const member = guild.members.cache.get(targetUser.id)
    //     member.roles.add(role)
    //     message.reply(`<@${member.id}> now has the ${role} role`)
    // }
});

(async function registerCommands(dir = 'cmds')
{
    let files = await fs.readdir(path.join(__dirname, dir))
    console.log(files);
    for(let file of files)
    {
        console.log(typeof file, file);
        let stat = await fs.lstat(path.join(__dirname, dir, file))
        if(stat.isDirectory())
        {
            registerCommands (path.join(dir, file));
        }
        else
        {
            if(file.endsWith(`.js`))
            {
                let cmdName = file.replace(`.js`, ``);
                console.log(`cmdName:`, cmdName);
                let cmdModule = require(path.join(__dirname, dir, file));
                console.log(`cmdModule:`, cmdModule);
                client.commands.set(cmdName, cmdModule);
                console.log(`Command Map:`, client.commands);
            }
        }
    }
})()

const isValidCommand = (message, cmdName) => 
message.content.toLowerCase().startsWith(prefix + cmdName);

const rollDice = () => Math.floor(Math.random() * 6) + 1;