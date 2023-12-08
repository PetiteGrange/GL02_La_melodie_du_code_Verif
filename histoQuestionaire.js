const fs = require('fs');
const questions = require("@caporal/core").default;
const vegaLiteApi = require('vega-lite-api');
const vegaLite = require('vega-lite');
const path = require('path');

//créait la commande "histogramme" disponible en invite de commande
questions
    .command('histogramme', "Affiche l'Histogramme d'un questionnaire")
    .alias("hg")
    .action(({args, options, logger}) => {
        
      
      histogramme();

    });

questions.run(process.argv.slice(2));


//function qui permet d'aficher et faire le comparatif entre un ou plusieurs questionnaires dans une page HTML
function histogramme() {
  
  //Permet d'ouvrir la page index.html
  openIndexHtml();

  //tout le corps du code se trouve dans la page HTML
  
}

//Créait une fonction qui permet d'ouvrir la page index.html dans un navigateur
const openIndexHtml = async () => {
    const path = require('path');
    const { exec } = require('child_process');
  
    // Chemin complet vers le fichier index.html
    const indexPath = path.join('index.html');
  
    // Ouvrir le fichier index.html dans le navigateur par défaut
    switch (process.platform) {
      case 'darwin': // macOS
        exec(`open ${indexPath}`);
        break;
      case 'win32': // Windows
        exec(`start ${indexPath}`);
        break;
      default: // Linux
        exec(`xdg-open ${indexPath}`);
    }
  };