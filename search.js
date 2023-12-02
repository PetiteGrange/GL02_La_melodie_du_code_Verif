const fs = require('fs');
const program = require("@caporal/core").default;
const colors = require('colors');

const path = require('path');
const directoryPath = path.join('data');

const mainModule = require('./main.js');
const { askQuestionType } = require('./askQuestionType');
const Question = require('./Question.js');
const filterQuestions = require('./filterQuestions');


program
    .command('searcht', 'permet de rechercher une question dans un fichier parmi la base de données en fonction du type de question')
    .argument('[name...]', 'nom du ou des fichiers')
    .option('-n, --word <word>', 'le nom du fichier contient "word"')
    .option('-c, --expression <expresssion>', "le fichier que l'on veut afficher contient 'expressio'")
    .option('-t, --type <type...>', 'le fichier contient des questions du type ')
    .action(async({args, options, logger}) =>{
     
        const selectedTypes = await askQuestionType();  //interface utilisateur pour choix des types voulus
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
                            const filteredQuestions = filterQuestions(parsedQuestions, selectedTypes);
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

                    logger.info(`Files containing "${options.n}": ${file}`.red);
                    filePath = path.join('data', file);
                    fs.readFile(filePath, 'utf-8', function(err, content) {
                        if (err) {  // afficher les erreurs
                          return console.log('Unable to scan file '+file+': '+err+'\n');
                        } else {
                            mainModule.toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                if (err) {
                                    console.error(err);
                                } else {
                                    const filteredQuestions = filterQuestions(parsedQuestions, selectedTypes);
                                }
                            });
                        }
                        //console.log(content + '\n'); 
                    })
                }  
                
                if(options.c){

                    filePath = path.join('data', file);
                    fs.readFile(filePath, 'utf-8', function(err,content){
                        if (err) {

                            return console.log('Unable to scan file '+file+': '+err+'\n');
                        } else if(content.includes(options.c)){

                            console.log(`File containing the expression "${options.c}": ${file}`);
                        }
                    })
                }
            })
        })

    })

    .command('searchf', "permet d'afficher un ou des fichiers à l'écran et permet à l'utilisateur de choisir des questions")
    .argument('<name...>', 'nom du ou des fichiers')
    .action(({args, logger}) => {


    })
program.run(process.argv.slice(2));