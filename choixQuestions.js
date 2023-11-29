const fs = require('fs');
const questions = require("@caporal/core").default;
const colors = require('colors');

const path = require('path');
const directoryPath = path.join('data');

questions

  // affichage
  .command('afficher', 'Afficher toutes les questions disponnibles dans la base de données')
  .action(() => {
    fs.readdir(directoryPath, function (err, files) {
        // afficher les erreurs
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // traitement pour chaque fichier du dossier
        files.forEach(function (file) {
            // on spécifie le bon chemin pour lire les fichiers
            filePath = path.join('data', file);
            fs.readFile(filePath, 'utf-8', function(err, content) {
              // afficher les erreurs
              if (err) {
                return console.log('Unable to scan file '+file+': '+err+'\n');
              }
              // afficher le nom du fichier puis l'entièreté du fichier
              console.log(`\n\n\n\n\n ${file} \n\n`.green);
              console.log(content + '\n');
            })
        });
    });
  })


questions.run(process.argv.slice(2));
