const fs = require('fs');
const Discord = require('discord.js');
const utility = require('../utility.js');

const SECONDS = 5000
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

function play(msg) {

    //Makes sure that only one game can be run at the same time
    if (gameActive) {
        msg.channel.send("Only one Never Have I ever-game can be played at once!");
        return;
    }    
    gameActive = true;

    //Reset available WYR-questions if the array is empty
    if (questions.length == 0) {
        questions = getQuestions();
    }

    let randNum = utility.genRandNum(0, questions.length-1);
    let question = questions[randNum];
    questions.splice(randNum, 1); //Remove the chosen question from the array

    const embed = new Discord.MessageEmbed()
            .setColor(0x0f5a96)
            .setFooter(`You have ${SECONDS/1000} seconds to vote. Type 'vote a' or 'vote b'.`)
            .setTitle(question)

    msg.channel.send(embed);
    //getVotes(msg, wyr);
}

module.exports = {
    play
}