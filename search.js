const fs = require('fs');
const program = require("@caporal/core").default;
const colors = require('colors');

const path = require('path');
const directoryPath = path.join('data');

const mainModule = require('./main.js');

const Question = require('./Question.js');
const filterQuestions = require('./filterQuestions');


program
    .command('searchf', 'permet de rechercher une question dans un fichier parmi la base de données')
    .argument('[name...]', 'nom du ou des fichiers')
    .option('-n, --word <word>', 'le nom du fichier contient "word"')
    .option('-c, --expression <expresssion>', "le fichier que l'on veut afficher contient 'expression'")
    .action(({args, options, logger}) =>{
        if (args.name) {
            args.name.forEach(filename => {  //pour chaque fichier dont le nom a été entré par l'utilisateur
                const filePath = path.join('data', filename);  //création du chemin
                fs.readFile(filePath, 'utf-8', (err, content) => {  //lecture du fichier
                    if (err) {
                        return console.log('Unable to scan file ' + filename + ': ' + err + '\n');
                    }
                    console.log("\n--------------------------------------------".green)
                    console.log('name of the file:', filename.green); //affichage du nom 
                    console.log("--------------------------------------------".green,'\n')
                    console.log(content + '\n');  //affichage du contenu 
        
                    mainModule.toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(parsedQuestions)
                        }
                    });
                });
            });
        }

        fs.readdir(directoryPath, function (err, files) {

            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            
            files.forEach(function(file){  //pour tous les fichiers, on regarde quelle option a été choisie

                if(options.n && file.includes(options.n)){
                    console.log(`Files with name containing "${options.n}": ${file}`.red);
                    filePath = path.join('data', file);
                    fs.readFileSync(filePath, 'utf-8', function(err, content) {
                        if (err) {  // afficher les erreurs
                          return console.log('Unable to scan file '+file+': '+err+'\n');
                        }
                        console.log("\n--------------------------------------------".green)
                        console.log('name of the file:', filename.green); //affichage du nom 
                        console.log("--------------------------------------------".green,'\n')
                        console.log(content + '\n');  //affichage du contenu 
            
                        mainModule.toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(parsedQuestions)
                            }
                        });
                        //console.log(content + '\n'); 
                    })
                }  
                
                if(options.c){
                    logger.info(`Files containing "${options.c}": ${file}`.red);
                    filePath = path.join('data', file);
                    fs.readFileSync(filePath, 'utf-8', function(err, content) {
                        if (err) {  // afficher les erreurs
                          return console.log('Unable to scan file '+file+': '+err+'\n');
                        }
                        console.log("\n--------------------------------------------".green)
                        console.log('name of the file:', filename.green); //affichage du nom 
                        console.log("--------------------------------------------".green,'\n')
                        console.log(content + '\n');  //affichage du contenu 
            
                        mainModule.toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(parsedQuestions)
                            }
                        });
                        //console.log(content + '\n'); 
                    })
                }
            })
        })

    })

  
program.run(process.argv.slice(2));