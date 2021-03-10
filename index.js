const Discord = require('discord.js');
const config = require('./hiddenConfig.json')
const bot = new Discord.Client();

TOKEN = config.token;
PREFIX = config.prefix;

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.login(TOKEN);

bot.on('message', (msg) => {

    let args = msg.content.substring(PREFIX.length).split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (!msg.content.startsWith(PREFIX)) return; // bot will only reply if the message starts with the specified prefix

    // Handle arguments given
    switch (args[0].toLowerCase()) {
        case 'test':
            msg.channel.send("Bot is working");
            break;

        default:
            msg.channel.send(args[0] + " is not a valid command.");
    }
});