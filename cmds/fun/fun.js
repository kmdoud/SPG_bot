const {rollDice} = require('../../util/dicefn');

module.exports.run = async(client, message, args) =>
{
    message.reply(`rolled a ${rollDice()}`);
}