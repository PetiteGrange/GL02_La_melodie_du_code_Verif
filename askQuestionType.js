// askQuestionType.js

const readline = require('readline');

const QuestionType = {
    VF: 'QUESTION_VRAI_FAUX',
    QCU: 'QUESTION_CHOIX_UNIQUE',
    QCM: 'QUESTION_CHOIX_MULTIPLE',
    ASSO: 'QUESTION_ASSOCIATION',
    NUM_E: 'QUESTION_NUMERIQUE_ECART',
    NUM_R: 'QUESTION_NUMERIQUE_RANGE',
    TEXT: 'QUESTION_TEXT',
    TAT: 'QUESTION_TEXT_A_TROUS',
    EXAMPLE: 'EXAMPLE',
    MM: 'MOT_MANQUANT',
};

function askForFileTypes(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Choisissez un ou plusieurs types de fichiers parmi les options suivantes (utilisez les abréviations) :\n' +
        Object.keys(QuestionType).map(abbr => `${abbr}: ${QuestionType[abbr]}`).join('\n'));

    rl.question('Saisissez les abréviations des types de fichiers séparées par des virgules :\n', (answer) => {
        const selectedAbbrs = answer.split(',').map(abbr => abbr.trim());
        const validTypes = selectedAbbrs.filter(abbr => QuestionType[abbr]);

        if (validTypes.length > 0) {
            console.log(`Vous avez choisi les types de fichiers : ${validTypes.map(abbr => QuestionType[abbr]).join(', ')}`);
            callback(validTypes);
        } else {
            console.log('Aucun type de fichier valide. Veuillez choisir parmi les options fournies en utilisant les abréviations.');
        }

        rl.close();
    });
}

module.exports = askForFileTypes;  // Exporter la fonction directement
module.exports.QuestionType = QuestionType;  // Exporter la constante QuestionType
