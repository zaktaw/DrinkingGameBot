const Discord = require('discord.js');
const wyr = require('./wyr/wyr.js')
const nhie = require('./nhie/nhie.js')
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log("Bot is online!");
}); 


bot.login(process.env.DRINKING_GAME_BOT_TOKEN);

bot.on('message', (msg) => {

    let args = msg.content.split(" ");

    // Prevent spam from bot
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (msg.channel.id != process.env.DRINKING_GAME_BOT_CHANNEL_ID) return; // bot will only reply in the specified channel

    // Handle arguments given
    switch (args[0].toLowerCase()) {
    
        // use question from user
        case 'wyr':
            if (args[1]) {
                if (!msg.content.includes("or")) return msg.channel.send("Error: The following format must be used: !wyr alternative1 or alternative2").then(message => message.delete({ timeout: 6000 }))
                let userQuestion = msg.content.substring(args[0].length) // extract the question from the command 
                wyr.play(msg, userQuestion)
            }

            // use random question
            else wyr.play(msg, null)
            break;

        case 'nhie':

            // use question from user
            if (args[1]) {
                let userQuestion = msg.content.substring(args[0].length) // extract the question from the command 
                nhie.play(msg, userQuestion)
            }

            // use random question
            else nhie.play(msg, null)
            break;

        default:
            msg.channel.send(args[0] + " is not a valid command.");
    }
});