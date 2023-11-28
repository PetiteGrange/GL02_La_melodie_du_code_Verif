const fs = require('fs')
const directoryPath = "./data"
const program = require('caporal')

program

    .command('search', 'afficher une question spécifique, en fonction de son nom ou de critères de recherche')
    .argument('<criteria>', 'critère que les fichiers à afficher doivent vérifier')
    .action(({args, logger}) =>{
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