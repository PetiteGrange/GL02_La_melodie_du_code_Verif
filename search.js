    //Importation des différentes features extérieures nécessaires au fonctionnement du programme
    const fs = require('fs');  //fs sert à lire les dossiers et fichiers.
    const program = require("@caporal/core").default;  //importation de caporal pour créer des commandes
    const colors = require('colors');  //importation de colors pour pouvoir afficher du texte en couleur

    const path = require('path');  //chemin absolu pour faciliter l'ecriture de chemins
    const directoryPath = path.join('data');

    const Question = require('./Question.js');  
    const QT = require('./QuestionType.js')  //importation de QuestionType pour avoir les différents type des questions
    const GiftParser = require('./GiftParser.js');  //importation de GiftParser pour parser un fichier en questions

    const inquirer = require('inquirer'); //ajout du module inquirer pour l'interface interactive

    program
        .command('searchFile', "permet de rechercher un ou des fichiers parmi la base de données, et d'afficher les questions de ces fichiers avec le type choisi")
        .alias('sf')
        .argument('[name...]', 'nom du ou des fichiers parmis lesquels on souhaite afficher des questions')
        .option('-n, --word <word>', "permet d'afficher le ou les fichiers dont le nom contient 'word'")
        .option('-c, --expression <expresssion>', "permet d'afficher le ou les fichiers dont le contenu contient 'expression'")
        .action(async({args, options, logger}) =>{

            const answers = await inquirer.prompt([  //le programme demande à l'utilisateur le type de questions qu'il souhaite afficher
                {
                    type: 'list',
                    message: 'Sélectionnez les types de questions à afficher:',
                    name: 'types',
                    choices: Object.values(QT)  //les types sont choisis parmis les types de questions définis dans QuestionType.js
                }
            ]);
    
            const selectedTypes = answers.types;
            console.log(selectedTypes)

            if (args.name) {  //dans le cas ou on a rentré le nom ou les noms de fichiers, on va parser les questions de chaque fichiers, et afficher celle avec le type correpondant au choix de l'utilisateur
                args.name.forEach(filename => {  //pour chaque fichier dont le nom a été entré par l'utilisateur
                    const filePath = path.join('data', filename);  //création du chemin
                    fs.readFile(filePath, 'utf-8', (err, content) => {  //lecture du fichier
                        if (err) {
                            return console.log('Impossible de scanner le fichier ' + filename + ': ' + err + '\n');  //gestion des erreurs
                        }
            
                        toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                            if (err) {
                                console.error(err);
                            } else {
                                const filteredQuestions = parsedQuestions.filter(question => {  //on filtre le tableau constituté des questions parsées, afin de ne garder que celles avec le bon type
                                    const includesSelectedType = selectedTypes.includes(question.type);
                                    return includesSelectedType;
                                });
                                
                                console.log('\nQuestions dont le type correspond à votre choix'.red + filename.red + ':', filteredQuestions);  //affichage des questions avec le type correspondant
                            }
                        });
                    });
                });
            }

            fs.readdir(directoryPath, function (err, files) {  //si le nom des fichiers n'a pas été fourni

                if (err) {
                    return console.log('Impossible de scanner le dossier: ' + err);  //gestion des erreurs
                }
                
                files.forEach(function(file){  //pour tous les fichiers du dossier, deux choix s'ouvrent

                    if(options.n && file.includes(options.n)){  //si l'option -n a été ajoutée, et que le nom du fichier contient 'word'
                        console.log(`Files with name containing "${options.n}": ${file}`.red);
                        const filePath = path.join('data', file);  //création du chemin
                        fs.readFile(filePath, 'utf-8', function(err, content) {  //lecture du fichier
                            if (err) {
                            return console.log('Unable to scan file '+file+': '+err+'\n');  //gestion des erreurs
                            }
                            toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                if (err) {
                                    console.error(err);
                                } else {
                                    const filteredQuestions = parsedQuestions.filter(question => {  //on filtre le tableau constituté des questions parsées, afin de ne garder que celles avec le bon type
                                        const includesSelectedType = selectedTypes.includes(question.type); 
                                        return includesSelectedType;
                                    });
                                    
                                    console.log('\nQuestions with matching types from '.red + file.red + ':', filteredQuestions);  //affichage des questions avec le type correspondant
                                }
                            }); 
                        })
                    }  
                    
                    if (options.c) {  //si l'option -c a été ajoutée, on va alors ouvrir chaque fichier et vérifier si le contenu contient 'expression'
                        const filePath = path.join('data', file);  //création du chemin
                        fs.readFile(filePath, 'utf-8', function (err, content) {  //lecture du fichier
                            if (err) {
                                return console.log('Unable to scan file ' + file + ': ' + err + '\n');  //gestion des erreurs
                            }

                            if (content.includes(options.c)) {  //on vérifie que le contenue contient 'expression'
                                console.log(`Le fichier ${file} contient l'expression "${options.c}".`.red);
                    
                                toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        const filteredQuestions = parsedQuestions.filter(question => {  //on filtre le tableau constituté des questions parsées, afin de ne garder que celles avec le bon type
                                            const includesSelectedType = selectedTypes.includes(question.type);
                                            return includesSelectedType;
                                        });
                                        
                                        console.log('\nQuestions with matching types from '.red + file.red + ':', filteredQuestions);  //affichage des questions avec le type correspondant

                                    }
                                });
                            }
                        });
                    }
                })
            })

        })

        .command('displayf', "permet d'afficher toutes les questions d'ou ou de plusieurs fichiers, sans trier par type de question")
        .alias('df')
        .argument('[file...]', "nom du ou des fichiers que l'on veut afficher")
        .option('-a', 'affiche tous les fichiers')
        .action(({args, options, logger}) => {
            if (options.a) {  //si l'option -a a été ajoutée, on va tout simplement scanner tout le dossier et afficher chaque question de chaque fichier
                fs.readdir(directoryPath, function (err, files) {  //lecture de tout le dossier
                    console.log(files)
                    if (err) {
                        return console.log('Unable to scan directory: ' + err); //gestion des erreurs
                    }
                    files.forEach(function (file) {  
                        const filePath = path.join('data', file);  //création du chemin
                        fs.readFile(filePath, 'utf-8', function (err, content) {  //lecture du fichier
                            if (err) {  
                                return console.log('Unable to scan file ' + file + ': ' + err + '\n');  //gestion des erreurs
                            }
                            toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                if (err) {
                                    console.error(err);  //gestion des erreurs
                                } else {
                                    console.log(`\n${file}`.red, parsedQuestions, '\n')  //affichage des questions du fichier une fois parsées
                                }
                            });
                        });
                    });
                });
            } else if (args.file) {  //si des noms de fichiers ont été entrés
                args.file.forEach(filename => {  //pour chaque fichier dont le nom a été entré par l'utilisateur
                    const filePath = path.join('data', filename);  //création du chemin
                    fs.readFile(filePath, 'utf-8', (err, content) => {  //lecture du fichier
                        if (err) {
                            return console.log('Unable to scan file ' + filename + ': ' + err + '\n');  //gestion des erreurs
                        }

                        toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                            if (err) {
                                console.error(err);  //gestion des erreurs
                            } else {
                                console.log(parsedQuestions)  //affichage des questions du fichier une fois parsées
                            }
                        });
                    });
                });
            }
        });

    /*
    Description : Fonction de parsing des questions d'un fichier
    Entrée : file (string) => nom du fichier à parser
    Entrée : callback (function) => appel d'une autre fonction pour traiter les données
    Fonctionnement : lecture du fichier, création d'un nouvel objet GiftParser, et mise en branle du parsing dans GiftParser.js
    Sortie : AUCUNE
    */

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