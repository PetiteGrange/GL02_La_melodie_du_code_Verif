const inquirer = require('inquirer');
const QuestionType = require('./QuestionType');

async function askQuestionType() {
    const questionTypes = Object.values(QuestionType);

    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedTypes',
            message: 'Choisissez le type de question que vous voulez afficher :',
            choices: questionTypes,
        },
    ]);

    return answers.selectedTypes;
}
askQuestionType();

module.exports = {
    askQuestionType,
};
