    // Importation des différentes features extérieures
    // nécessaires au fonctionnement du programme.

    const fs = require('fs');  // fs sert à lire les dossiers et fichiers.
    const program = require("@caporal/core").default;  //importation de caporal pour créer des commandes
    const colors = require('colors');  //importation de colors pour pouvoir afficher du texte en couleur

    const path = require('path');  //chemin absolu pour faciliter l'ecriture de chemins
    const directoryPath = path.join('data');

    const Question = require('./Question.js');  
    const QT = require('./QuestionType.js')  //importation de QuestionType pour avoir les différents type des questions
    const GiftParser = require('./GiftParser.js');  //importation de GiftParser pour parser un fichier en questions





    program
        .command('searchf', 'permet de rechercher un fichier parmi la base de données')
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
            
                        toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
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
                        const filePath = path.join('data', file);
                        fs.readFile(filePath, 'utf-8', function(err, content) {
                            if (err) {  // afficher les erreurs
                            return console.log('Unable to scan file '+file+': '+err+'\n');
                            }
                            console.log("\n--------------------------------------------".green)
                            console.log('name of the file:', file.green); //affichage du nom 
                            console.log("--------------------------------------------".green,'\n')
                            console.log(content + '\n');  //affichage du contenu 
                
                            toQuestion(filePath, (err, parsedQuestions) => {  //parsing en objets de type question
                                if (err) {
                                    console.error(err);
                                } else {
                                    console.log(parsedQuestions)
                                }
                            });
                            //console.log(content + '\n'); 
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
                                console.log(`Le fichier ${file} contient l'expression "${options.c}".`);
                    
                                // Vous pouvez également ajouter ici la logique pour traiter le fichier si nécessaire
                                toQuestion(filePath, (err, parsedQuestions) => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log(parsedQuestions);
                                    }
                                });
                            }
                        });
                    }
                })
            })

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