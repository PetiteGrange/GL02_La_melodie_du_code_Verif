const fs = require('fs');
const questions = require("@caporal/core").default;
const colors = require('colors');
const inquirer = require('inquirer');

const path = require('path');
const directoryPath = path.join('data');
const mainModule = require('./main.js');

questions

  // affichage
  .command('afficher', 'Afficher les différents fichiers disponnibles contenant des questions')
  .action(() => {
    // lecture du dossier contenant tous les fichiers de questions
    fs.readdir(directoryPath, async function (err, files) {
        // affichage des erreurs
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // choix du fichier à ouvrir
        let file = await choixFichier(files);
        //lecture du fichier
        filePath = path.join(directoryPath, file.toString());
        fs.readFile(filePath, 'utf-8', function(err, content) {
          // affichage des erreurs
          if (err) {
            return console.log('Unable to scan file '+file+': '+err+'\n');
          }
          // affichage des questions du fichier sélectionné
          mainModule.toQuestion(filePath, async function (err, parsedQuestions) {  //parsing en objets de type question
              if (err) {
                  // affichage des erreurs
                  console.error(err);
              } else {
                  let numQuestions = [];
                  let i = 1;
                  parsedQuestions.forEach((item) => {
                    numQuestions.push(i);
                    i++;
                  });
                  let questionChoisie = await choixQuestion(numQuestions);
                  console.log(parsedQuestions[questionChoisie-1]);
              }
          });
        })
        });
    });



  async function choixFichier(names) {

      const answers = await inquirer.prompt([
          {
              type: 'checkbox',
              name: 'selectedTypes',
              message: 'Choisissez le fichier que vous voulez ouvrir',
              choices: names,
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

      return answers.selectedTypes;
  }

questions.run(process.argv.slice(2));
