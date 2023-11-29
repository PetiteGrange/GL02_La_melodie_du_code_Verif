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
            //for each file, comparing question type with <criteria>
            files.forEach(function(files){
                    //generate question from the file
                    //if ctype of at least one question in the file is the same as criteria, display it 
                    //else, logger.warn(err)
            })
        })

    })