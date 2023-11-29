const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require('./Question.js');
const QuestionType = require('./QuestionType.js');
const giftToObject = require('./giftToObject.js'); //maybe renvoit pas qu'un objet




questions
    .command('histogramme', "Affiche l'Histogramme d'un questionnaire")
    .argument('<questionaire>', 'questionaire avec les questions en format GIFT')
    //.option('-s, --AFaire', 'avec couleur?', { validator : questions.BOOLEAN, default: false })
    //.option('-t, --Afaire2', 'bidule chouette', { validator: questions.BOOLEAN, default: false })
    .action(({args, options, logger}) => {
    
    const questionary = args.questionaire ;
    console.log(questionary);
    });

questions.run(process.argv.slice(2));