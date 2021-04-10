require('dotenv').config();
const tokenFile = require('./token');
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

client.on('message', async function(message)
{
    if(message.author.bot) return;
    let cmdArgs = message.content.replace(`!`, ``).split(new RegExp(/\s+/));
    console.log(`commandContent:`,cmdArgs);
    let commandName = getCommandName(cmdArgs);
    console.log('CommandName:',commandName);
    console.log(`cmdArgs:`, cmdArgs);
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

const getCommandName = (message) =>
message.shift();

const rollDice = () => Math.floor(Math.random() * 6) + 1;