const fs = require('fs').promises;
const inquirer = require('inquirer');
const path = require('path');
const GiftParser = require('./GiftParser.js');
const questions = require('@caporal/core').default;

const directoryPath = path.join('data');

let questionnaireFini;

questions
  .command('créerQuestionnaire', 'Afficher les différents fichiers disponibles contenant des questions')
  .action(async function () {
    let questionnaire = [];
    questionnaireFini = false;
    let question;
    let ajout = '';
    while (questionnaireFini == false) {
      question = await selectQuestion();
      console.log(question);
      if (questionnaireFini == false) {
        ajout = await ajoutQuestion();
        if (ajout == 'Oui') {
          questionnaire.push(question);
          console.log('Vous avez ajouté cette question au questionnaire. Le questionnaire a '+questionnaire.length+' questions.');
        }
      }
    }
    console.log('******************************'.green);
    console.log('Voici votre questionnaire'.green);
    console.log('******************************'.green);
    console.log(questionnaire);
  });

async function selectQuestion() {
  try {
    const files = await fs.readdir(directoryPath);
    const selectedFiles = await choixFichier(files);
    if (selectedFiles == 'Terminer') {questionnaireFini = true;}
    const filePath = path.join(directoryPath, selectedFiles[0]);

    const content = await fs.readFile(filePath, 'utf-8');
    const parsedQuestions = await giftToQuestion(content);

    const numQuestions = parsedQuestions.map((_, index) => index + 1);
    const questionChoisie = await choixQuestion(numQuestions);

    return parsedQuestions[questionChoisie - 1];
  } catch (err) {
    console.error(err);
  }
}

async function choixFichier(choix) {
    if (choix[choix.length-1] != 'Terminer') {choix.push('Terminer');}
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedTypes',
            message: 'Choisissez le fichier que vous voulez ouvrir',
            choices: choix,
        },
    ]);

    return answers.selectedTypes;
}

async function choixQuestion(questions) {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTypes',
      message: 'Choisissez le numéro de question que vous voulez visionner :',
      choices: questions,
    },
  ]);

  return answers.selectedTypes[0];
}

async function ajoutQuestion(variable) {

    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedTypes',
            message: 'Voulez-vous ajouter cette question au questionnaire ?',
            choices: ['Oui','Non'],
        },
    ]);

    return answers.selectedTypes;
}

async function giftToQuestion(data) {
  const analyzer = new GiftParser();
  analyzer.parse(data);
  return analyzer.parsedQuestions;
}

async function ajoutQuestion() {

    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedTypes',
            message: 'Voulez-vous ajouter cette question au questionnaire ?',
            choices: ['Oui','Non'],
        },
    ]);

    return answers.selectedTypes;
}

questions.run(process.argv.slice(2));
