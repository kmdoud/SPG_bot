require('dotenv').config();
require('module-alias/register');
const tokenFile = require('@root/token');
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
    //no command sent by a bot will be executed
    if(message.author.bot) return;
    //ensure the prefix `!` is used
    if(!message.content.startsWith(prefix)) return;
    //create array of strings called cmdArgs
    let cmdArgs = message.content.replace(`!`, ``).split(new RegExp(/\s+/));
    console.log(`commandContent:`,cmdArgs);
    //extract the name of the command from the array
    let commandName = getCommandName(cmdArgs);
    console.log('CommandName:',commandName);
    console.log(`cmdArgs:`, cmdArgs);
    //search the map for the command name, if exist execute the run function
    if(client.commands.get(commandName))
    {
        client.commands.get(commandName).run(client, message, cmdArgs);
    }
    else
    {
        console.log(`${commandName}: Unknown command, please type !help for the command list`);
    }
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