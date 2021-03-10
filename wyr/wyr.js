const fs = require('fs');
const Discord = require('discord.js');

// get data from text file, make an array of JSON-objects and return the array
function getData() {
    let wyrQuestions = [];
    let data = fs.readFileSync('./wyr/wyr.txt', 'utf8');

    data = data.split('\n')
    data.forEach(line => {
        first_alternative = line.split(";")[0]
        second_alternative = line.split(";")[1]
        wyrArray.push({"first_alternative": first_alternative, "second_alternative": second_alternative})
    }); 

    return wyrQuestions
}

let wyrQuestions = getData();

