const fs = require('fs');
const program = require("@caporal/core").default;
const colors = require('colors');

const path = require('path');
const directoryPath = path.join('data');

const mainModule = require('./main.js');
const { askQuestionType } = require('./askQuestionType');


program
    .command('searchf', 'permet de rechercher une question dans un fichier parmi la base de données')
    .argument('[name...]', 'nom du ou des fichiers')
    .option('-n, --word <word>', 'le nom du fichier contient "word"')
    .option('-c, --expression <expresssion>', 'le fichier que l on veut afficher contient "expression"')
    .option('-t, --type <type...>', 'le fichier contient des questions du type ')
    .action(async ({args, options, logger}) =>{
        
        if (args.name) {
            const selectedTypes = await askQuestionType();  //interface utilisateur pour choix des types voulus
            args.name.forEach(filename => {  //pour chaque fichier dont le nom a été entré par l'utilisateur

                console.log(filename);
                const filePath = path.join('data', filename);  //création du chemin
        
                fs.readFile(filePath, 'utf-8', (err, content) => {  //lecture du fichier
                    if (err) {
                        return console.log('Unable to scan file ' + filename + ': ' + err + '\n');
                    }
                    console.log('\n\nname of the file:'.red, filename.red, '\n\n'); //affichage du nom 
                    console.log(content + '\n\n\n');  //affichage du contenu 
        
                    mainModule.toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                        if (err) {
                            console.error(err);
                        } else {
                            const filteredQuestions = parsedQuestions.filter(question => {  //filtrage en fonction des types
                                return selectedTypes.includes(question.type);
                            });

                            console.log(selectedTypes, '\n\n\n')  //affichage des types selectionnés
                            console.log(filteredQuestions);  //affichage des questions avec le bon type
                            //console.log(parsedQuestions)
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

            //for each file, comparing question type with the options
            files.forEach(function(file){

                if(options.n && file.includes(options.n)){

                    console.log(`File with name containing "${options.n}": ${file}`.red);
                    filePath = path.join('data', file);
                    fs.readFile(filePath, 'utf-8', function(err, content) {
                        // afficher les erreurs
                        if (err) {
                          return console.log('Unable to scan file '+file+': '+err+'\n');
                        }
                        console.log(content + '\n'); 
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
program.run(process.argv.slice(2));