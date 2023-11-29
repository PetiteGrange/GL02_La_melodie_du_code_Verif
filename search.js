const fs = require('fs')
const directoryPath = "./data"
const program = require('caporal')

program

    .command('search_files', 'afficher une question spécifique, en fonction de son nom ou de critères de recherche')
    .alias("sf")
    .argument('[name...]', 'nom du ou des fichiers')
    .option('-nc <word>', 'le nom du fichier contient "word"')
    .option('-c <expresssion>', 'le fichier que l on veut afficher contient "expression"')
    .option('-t <type...>', 'le fichier contient des questions du type ')
    .action(({args, options, logger}) =>{
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //for each file, comparing question type with the options

            files.forEach(function(files){
                if(options.nc && files.includes(options.nc)){
                    console.log(`File with name containing "${options.nc}": ${file}`);
                    fs.readFile(filePath, 'utf-8', function(err, content) {
                        // afficher les erreurs
                        if (err) {
                          return console.log('Unable to scan file '+file+': '+err+'\n');
                        }
                        console.log(content + '\n');
                    })
                }          
            })
        })

    })