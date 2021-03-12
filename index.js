const Discord = require('discord.js');
const config = require('./config.json')
const wyr = require('./wyr/wyr.js')
const nhie = require('./nhie/nhie.js')
const bot = new Discord.Client();

TOKEN = config.token;
PREFIX = config.prefix;
CHANNEL_ID = config.channelID

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
    if (msg.channel.id != CHANNEL_ID) return; // bot will only reply in the specified channel

    // Handle arguments given
    switch (args[0].toLowerCase()) {
    
        // use question from user
        case 'wyr':
            if (args[1]) {
                if (!msg.content.includes("or")) return msg.channel.send("Error: The following format must be used: !wyr alternative1 or alternative2").then(message => message.delete({ timeout: 6000 }))
                let userQuestion = msg.content.substring(PREFIX.length + args[0].length) // extract the question from the command 
                wyr.play(msg, userQuestion)
            }

            // use random question
            else wyr.play(msg, null)
            break;

        case 'nhie':

            // use question from user
            if (args[1]) {
                let userQuestion = msg.content.substring(PREFIX.length + args[0].length) // extract the question from the command 
                nhie.play(msg, userQuestion)
            }

            // use random question
            else nhie.play(msg, null)
            break;

        default:
            msg.channel.send(args[0] + " is not a valid command.");
    }
});