const program = require("@caporal/core").default;
const Create = require('./vcardGenerator');

program

    .command('createVCard', "permet de créer une VCard avec les paramètres rentrés par l'utilisateur")
    .alias('cvc')
    .action(() => {
        Create.askQuestions();
    })

program.run(process.argv.slice(2));