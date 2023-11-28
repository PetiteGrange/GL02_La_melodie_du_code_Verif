const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require ('./Question.js');

const path = require('path');
const directoryPath = path.join('data');

questions

  // affichage
  .command('afficher', 'Afficher toutes les questions disponnibles dans la base de données')
  .action(() => {
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file + '\n\n');
            filePath = path.join('data', file);
            fs.readFile(filePath, 'utf-8', function(err, content) {
              if (err) {
                return console.log('Unable to scan file '+file+': '+err+'\n');
              }
              console.log(content + '\n');
            })
        });
    });
  })


questions.run(process.argv.slice(2));
