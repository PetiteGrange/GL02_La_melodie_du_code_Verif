// Importation des différentes features extérieures
// nécessaires au fonctionnement du programme.

// fs sert à lire les dossiers et fichiers.
// C'est une fonction asynchrone donc pour être sûr
// que le programme attend bien sa réalisation,
// fs est liée à une promesse.
const fs = require('fs').promises;

// inquirer permet de faire une 'interface' de choix.
const inquirer = require('inquirer');

// le path est nécessaire pour lire les fichiers.
const path = require('path');
// la base de données est dans le dossier data.
const directoryPath = path.join('data');

// le GiftParser est nécessaire pour transformer le fichier
// en différents objets question.
const GiftParser = require('./GiftParser.js');

// On utilise caporal pour créer une commande
const programme = require('@caporal/core').default;

// La variabe questionnaireFini est globale pour pouvoir être
// modifiée depuis plusieurs fonctions.
let questionnaireFini;

programme
  .command('créerQuestionnaire', 'Afficher les différents fichiers disponibles contenant des questions')
  .action(async function () {
    // Déclaration des variables qui seront utilisées dans la boucle.
    let questionnaire = [];
    questionnaireFini = false;
    let question;
    let ajout = '';
    let questionARetirer;
    // Boucle while qui se termine quand l'utilisateur considère
    // qu'il a terminé de sélectionner les questions.
    while (questionnaireFini == false) {
      // Selection d'une question
      question = await selectQuestion();
      // Si l'utilisateur n'a pas terminé...
      if (questionnaireFini == false) {
        // ...on vérifie que la question ne soit pas déjà dans le questionnaire.
        if (questionnaire.find(x => x.title == question.title)) {
          console.log('\n\n\n------------------------------'.cyan);
          console.log(`Cette question fait déjà partie de votre questionnaire.`.brightCyan);
          console.log(`C'est la question n° ${questionnaire.findIndex(x => x.title == question.title)+1}`.brightCyan);
          console.log('------------------------------\n\n\n'.cyan);
        } else {
          // Sinon, on lui demande si il veut ajouter la question.
          console.log(question);
          ajout = await ajoutQuestion();
          // Si l'utilisateur veut ajouter la question...
          if (ajout == 'Oui') {
            // ... on l'ajoute au questionnaire.
            questionnaire.push(question);
            console.log('\n\n\n------------------------------'.cyan);
            console.log(`Vous avez ajouté cette question au questionnaire. Le questionnaire a ${questionnaire.length} question(s).`.brightCyan);
            console.log('------------------------------\n\n\n'.cyan);
          } else {
            console.log('\n\n\n------------------------------'.cyan);
            console.log(`Vous n'avez pas ajouté cette question au questionnaire. Le questionnaire a ${questionnaire.length} question(s).`.brightCyan);
            console.log('------------------------------\n\n\n'.cyan);
          }
        }
      }
      if (questionnaireFini == true) {
        // Si on essaye de terminer le questionnaire alors qu'il est trop court
        // alors le programme empêche la sortie de la boucle
        // et demande de sélectionner plus de questions.
        if (questionnaire.length < 15) {
          console.log('\n\n\n------------------------------'.cyan);
          console.log (`Votre questionnaire est trop court (${questionnaire.length} questions). Veuillez en sélectionner plus pour en avoir au moins 15.`.brightYellow);
          console.log('------------------------------\n\n\n'.cyan);
          questionnaireFini = false;
        }
        // Si on essaye de terminer le questionnaire alors qu'il est trop long
        // alors le programme demande d'enlever assez de questions
        // avant de sortir de la boucle.
        while (questionnaire.length > 20) {
          console.log('\n\n\n------------------------------'.cyan);
          console.log (`Votre questionnaire est trop long. Veillez retirer une questionon.`.brightYellow);
          console.log('------------------------------\n\n\n'.cyan);
          // Affichage d'une liste avec tous les titres des questions choisies
          // L'utilisateur choisit une par une les questions à retirer
          // jusqu'à ce qu'il en reste 20.
          questionARetirer = await retirerQuestion (questionnaire);
          questionnaire.splice(questionnaire.findIndex(x => x.text == questionARetirer),1)
        }
      }
    }
    // Une fois que le questionnaire est fini, on l'affiche.
    console.log('------------------------------'.cyan);
    console.log('Voici votre questionnaire'.cyan);
    console.log('------------------------------'.cyan);
    console.log(questionnaire);
  });

async function selectQuestion() {
  // Gestion des erreurs en mettant toute la fonction dans un 'try'
  try {
    // Lecture des noms de tous les fichiers de la base de données
    let listeFichiers = await fs.readdir(directoryPath);
    // Affichage de tous les noms de fichiers
    // On demande à l'utilisateur lequel ouvrir pour avoir accès aux questions
    let fichierChoisi = await choixFichier(listeFichiers);

    if (fichierChoisi == 'Terminer') {
      // Si l'utilisateur a choisi l'option 'Terminer' alors
      // on essaye de sortir de la boucle dans la commande.
      questionnaireFini = true;
    } else {
      // Sinon, on ouvre le fichier sélectionné
      // et on laisse le choix à l'utilisateur de la question à selectionner.
      let filePath = path.join(directoryPath, fichierChoisi.toString());
      let contenuDuFichier = await fs.readFile(filePath, 'utf-8');
      let questionsDuFichier = await giftToQuestion(contenuDuFichier);

      // On récupère la question choisie dans la liste des questions du dossier
      // et on la renvoie à la commande principale.
      let questionChoisie = await choixQuestion(questionsDuFichier);
      return questionsDuFichier[questionsDuFichier.findIndex(x => x.title == questionChoisie)];
    }
  // suite du 'try', affichage si il y a une erreur,
  // et la fonction ne retourne rien
  } catch (err) {
    console.error(err);
  }

}

// Cette fonction utilise l'inquirer pour permettre à l'utilisateur
// de faire un choix parmi les fichiers de la base de données.
// On ajoute l'option 'Terminer' pour finir la sélection.
async function choixFichier(choix) {
    if (choix[choix.length-1] != 'Terminer') {choix.push('Terminer');}
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTypes',
            message: 'Choisissez le fichier que vous voulez ouvrir',
            choices: choix,
        },
    ]);

    return answers.selectedTypes;
}

// Cette fonction utilise l'inquirer pour permettre à l'utilisateur
// de faire un choix parmi les différentes questions d'un fichier.
// Ce choix se fait parmi les titres des questions.
async function choixQuestion(questions) {
  let choix = [];
  questions.forEach((i) => choix.push(i.title));
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTypes',
      message: 'Choisissez le numéro de question que vous voulez visionner :',
      choices: choix,
    },
  ]);

  return answers.selectedTypes;
}

// Cette fonction utilise l'inquirer pour permettre à l'utilisateur
// de confirmer l'ajout d'une question au questionnaire.
async function ajoutQuestion() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTypes',
            message: 'Voulez-vous ajouter cette question au questionnaire ?',
            choices: ['Oui','Non'],
        },
    ]);
    return answers.selectedTypes;
}

// Cette fonction utilise l'inquirer pour permettre à l'utilisateur
// de sélectionner une question à retirer du questionnaire.
async function retirerQuestion(questions) {
  let choix = [];
  questions.forEach((i) => choix.push(i.title));
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTypes',
            message: 'Quelle question voulez-vous retirer ?',
            choices: choix,
        },
    ]);
    return answers.selectedTypes;
}

// Cette fonction utilise le GiftParser pour transformer un fichier
// en différents objets, chacun représentant une question.
async function giftToQuestion(data) {
  const analyzer = new GiftParser();
  analyzer.parse(data);
  return analyzer.parsedQuestions;
}


programme.run(process.argv.slice(2));
