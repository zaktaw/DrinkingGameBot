const fs = require('fs');
const Discord = require('discord.js');
const utility = require('../utility.js');

const SECONDS = 20
let gameActive = false;

// get data from text file, make an array of JSON-objects and return the array
function getQuestions() {
    let questions = [];
    let data = fs.readFileSync('./wyr/wyr.txt', 'utf8');

    data = data.split('\n')
    data.forEach(line => {
        alternative_a = line.split(";")[0]
        alternative_b = line.split(";")[1]
        questions.push({"alternative_a": alternative_a, "alternative_b": alternative_b})
    }); 

    return questions
}

let questions = getQuestions();

function play(msg, userQuestion) {

    //Makes sure that only one game can be run at the same time
    if (gameActive) {
        msg.channel.send("Only one Would you rather-game can be played at once!")
            .then(message => message.delete({ timeout: 2000 }));
        return;
    }

    gameActive = true;

    let question = userQuestion;
    let alternative_a;
    let alternative_b;

    if (userQuestion) {
        alternative_a = question.split("or")[0]
        alternative_b = question.split("or")[1]
        if (alternative_b.substring(alternative_b.length-1) == "?") alternative_b = alternative_b.substring(0,alternative_b.length-1) // remove question mark if user added it
    }

    else {
        //Reset available questions if the array is empty
        if (questions.length == 0) {
            questions = getQuestions();
        }

        let randNum = utility.genRandNum(0, questions.length-1);
        question = questions[randNum];
        questions.splice(randNum, 1); //Remove the chosen question from the array

        alternative_a = question.alternative_a
        alternative_b = question.alternative_b
    }

    const embed = new Discord.MessageEmbed()
            .setColor(0xfc0303)
            .setFooter(`You have ${SECONDS} seconds to vote`)
            .setTitle('Would you rather')
            .addField('A', alternative_a)
            .addField('B', alternative_b)

    let a_votes = []
    let b_votes = []

    // only react to the specified emojes
    const filter = (reaction) => reaction.emoji.name === '🇦' || reaction.emoji.name === '🅱️';

    msg.channel.send(embed)
        .then(msg => msg.react('🇦') // make the emoji appear on the embed
        .then(() => msg.react('🅱️') // make the emoji appear on the embed
        .then(() => {
            const collector = msg.createReactionCollector(filter, { time: SECONDS*1000, dispose: true }); // dispose = true enables users to remove their votes by clicking on the emoji again
            
            // add votes to arrays
            collector.on('collect', (r, user) => {
                if (r.emoji.name == '🇦') a_votes.push({ "userId": user.id, "username": user.username });
                else if (r.emoji.name == '🅱️') b_votes.push({ "userId": user.id, "username": user.username });
            });

            // remove votes from arrays
            collector.on('remove', (r, user) => {
                if (r.emoji.name == '🇦') {
                    for (let i=0; i<a_votes.length; i++) {
                        if (a_votes[i].userId == user.id) {
                            a_votes.splice(i, 1)
                        }
                    }
                }

                else if (r.emoji.name == '🅱️') {
                    for (let i=0; i<b_votes.length; i++) {
                        if (b_votes[i].userId == user.id) {
                            b_votes.splice(i, 1)
                        }
                    }
                }
            });

            collector.on('end', collected => {

                let displayAVotes = "No votes for A"
                let displayBVotes = "No votes for B"

                // make a string of usernames for the a votes
                if (a_votes.length > 0) {
                    displayAVotes = a_votes[0].username
                    for (let i=1; i<a_votes.length; i++) {
                        displayAVotes += ", " + a_votes[i].username
                    }
                }

                // make a string of usernames for the b votes
                if (b_votes.length > 0) {
                    displayBVotes = b_votes[0].username
                    for (let i=1; i<b_votes.length; i++) {
                        displayBVotes += ", " + b_votes[i].username
                    }
                }
                
                // update embed with vote results
                const embed = new Discord.MessageEmbed()
                    .setColor(0xfc0303)
                    .setTitle('Results')
                    .addField(`A: ${alternative_a} (${a_votes.length})`, displayAVotes)
                    .addField(`B: ${alternative_b} (${b_votes.length})`, displayBVotes)

                msg.edit(embed)

                gameActive = false;
            });
        })))
}


module.exports = {
    play,
}