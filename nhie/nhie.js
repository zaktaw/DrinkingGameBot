const fs = require('fs');
const Discord = require('discord.js');
const utility = require('../utility.js');

const SECONDS = 20
let gameActive = false;

// get data from text file, make an array of JSON-objects and return the array
function getQuestions() {
    let questions = [];
    let data = fs.readFileSync('./nhie/nhie.txt', 'utf8');

    data = data.split('\n')
    data.forEach(line => {
        questions.push(line)
    }); 

    return questions
}

let questions = getQuestions();

function play(msg, userQuestion) {

    //Makes sure that only one game can be run at the same time
    if (gameActive) {
        msg.channel.send("Only one Never Have I ever-game can be played at once!")
            .then(message => message.delete({ timeout: 2000 }));
        return;
    }    
    gameActive = true;

    let question = "Never have I ever " + userQuestion

    if (!userQuestion) {
            //Reset available questions if the array is empty
        if (questions.length == 0) {
            questions = getQuestions();
        }

        let randNum = utility.genRandNum(0, questions.length-1);
        question = questions[randNum];
        questions.splice(randNum, 1); //Remove the chosen question from the array
    }

    const embed = new Discord.MessageEmbed()
            .setColor(0xfcf003)
            .setFooter(`You have ${SECONDS} seconds to vote`)
            .setTitle(question)

            let yesVotes = []
            let noVotes = []
        
            // only react to the specified emojes
            const filter = (reaction) => reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
        
            msg.channel.send(embed)
                .then(msg => msg.react('👍') // make the emoji appear on the embed
                .then(() => msg.react('👎') // make the emoji appear on the embed
                .then(() => {
                    const collector = msg.createReactionCollector(filter, { time: SECONDS*1000, dispose: true }); // dispose = true enables users to remove their votes by clicking on the emoji again
                    
                    // add votes to arrays
                    collector.on('collect', (r, user) => {
                        if (r.emoji.name == '👍') yesVotes.push({ "userId": user.id, "username": user.username });
                        else if (r.emoji.name == '👎') noVotes.push({ "userId": user.id, "username": user.username });
                    });
        
                    // remove votes from arrays
                    collector.on('remove', (r, user) => {
                        if (r.emoji.name == '👍') {
                            for (let i=0; i<yesVotes.length; i++) {
                                if (yesVotes[i].userId == user.id) {
                                    yesVotes.splice(i, 1)
                                }
                            }
                        }
        
                        else if (r.emoji.name == '👎') {
                            for (let i=0; i<noVotes.length; i++) {
                                if (noVotes[i].userId == user.id) {
                                    noVotes.splice(i, 1)
                                }
                            }
                        }
                    });
        
                    collector.on('end', collected => {
        
                        let displayYesVotes = "No people have done it"
                        let displayNoVotes = "No people have never done it"
        
                        // make a string of usernames for the a votes
                        if (yesVotes.length > 0) {
                            displayYesVotes = yesVotes[0].username
                            for (let i=1; i<yesVotes.length; i++) {
                                displayYesVotes += ", " + yesVotes[i].username
                            }
                        }
        
                        // make a string of usernames for the b votes
                        if (noVotes.length > 0) {
                            displayNoVotes = noVotes[0].username
                            for (let i=1; i<noVotes.length; i++) {
                                displayNoVotes += ", " + noVotes[i].username
                            }
                        }
                        
                        // update embed with vote results
                        const embed = new Discord.MessageEmbed()
                            .setColor(0xfcf003)
                            .setTitle('Results')
                            .addField(`People who have done it (${yesVotes.length})`, displayYesVotes)
                            .addField(`People who have never done it (${noVotes.length})`, displayNoVotes)
        
                        msg.edit(embed)
        
                        gameActive = false;
                    });
                })))
    
    
}

module.exports = {
    play
}