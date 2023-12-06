    // Importation des différentes features extérieures nécessaires au fonctionnement du programme.

    const fs = require('fs');  // fs sert à lire les dossiers et fichiers.
    const program = require("@caporal/core").default;  //importation de caporal pour créer des commandes
    const colors = require('colors');  //importation de colors pour pouvoir afficher du texte en couleur

    const path = require('path');  //chemin absolu pour faciliter l'ecriture de chemins
    const directoryPath = path.join('data');

    const Question = require('./Question.js');  
    const QT = require('./QuestionType.js')  //importation de QuestionType pour avoir les différents type des questions
    const GiftParser = require('./GiftParser.js');  //importation de GiftParser pour parser un fichier en questions

    const inquirer = require('inquirer'); // Ajout du module inquirer pour l'interface interactive

    program
        .command('searchf', "permet de rechercher un ou des fichiers parmi la base de données, et d'afficher les questions de ces fichiers avec le type choisi")
        .argument('[name...]', 'nom du ou des fichiers')
        .option('-n, --word <word>', "permet d'afficher les ou les fichiers dont le nom contient 'word'")
        .option('-c, --expression <expresssion>', "permet d'afficher les ou les fichiers dont le contenu contient 'expression'")
        .action(async({args, options, logger}) =>{

            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'Sélectionnez les types de questions à afficher:',
                    name: 'types',
                    choices: Object.values(QT)
                }
            ]);
    
            const selectedTypes = answers.types;
            console.log(selectedTypes)

            if (args.name) {
                args.name.forEach(filename => {  //pour chaque fichier dont le nom a été entré par l'utilisateur
                    const filePath = path.join('data', filename);  //création du chemin
                    fs.readFile(filePath, 'utf-8', (err, content) => {  //lecture du fichier
                        if (err) {
                            return console.log('Unable to scan file ' + filename + ': ' + err + '\n');
                        }
            
                        toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                            if (err) {
                                console.error(err);
                            } else {
                                const filteredQuestions = parsedQuestions.filter(question => {
                                    const includesSelectedType = selectedTypes.includes(question.type); // Comparer avec la clé
                                    return includesSelectedType;
                                });
                                
                                console.log('Filtered Questions from' + filename + ':', filteredQuestions);
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
                        const filePath = path.join('data', file);
                        fs.readFile(filePath, 'utf-8', function(err, content) {
                            if (err) {  // afficher les erreurs
                            return console.log('Unable to scan file '+file+': '+err+'\n');
                            }
                            toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                if (err) {
                                    console.error(err);
                                } else {
                                    const filteredQuestions = parsedQuestions.filter(question => {
                                        const includesSelectedType = selectedTypes.includes(question.type); // Comparer avec la clé
                                        return includesSelectedType;
                                    });
                                    
                                    console.log('\nFiltered Questions from '+ file + ':', filteredQuestions);
                                }
                            }); 
                        })
                    }  
                    
                    if (options.c) {
                        const filePath = path.join('data', file);
                        fs.readFile(filePath, 'utf-8', function (err, content) {
                            if (err) {
                                return console.log('Unable to scan file ' + file + ': ' + err + '\n');
                            }
                            // Vérification si le contenu du fichier contient l'expression spécifiée
                            if (content.includes(options.c)) {
                                console.log(`Le fichier ${file} contient l'expression "${options.c}".`.red);
                    
                                // Vous pouvez également ajouter ici la logique pour traiter le fichier si nécessaire
                                toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        const filteredQuestions = parsedQuestions.filter(question => {
                                            const includesSelectedType = selectedTypes.includes(question.type); // Comparer avec la clé
                                            return includesSelectedType;
                                        });
                                        
                                        console.log('\nFiltered Questions' + file + ':', filteredQuestions);

                                    }
                                });
                            }
                        });
                    }
                })
            })

        })

        .command('displayf', "permet d'afficher toutes les fichiers d'ou ou de plusieurs fichiers, sans critères")
        .argument('[file...]', "nom du ou des fichiers que l'on veut afficher")
        .action((args, logger) => {
            
        })

    function toQuestion(file, callback) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                return callback(err, null);
            }

            const analyzer = new GiftParser();
            analyzer.parse(data);

            callback(null, analyzer.parsedQuestions);
        });
    }
        
    program.run(process.argv.slice(2));