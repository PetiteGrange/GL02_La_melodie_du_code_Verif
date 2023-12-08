const inquirer = require('inquirer');
const QT = require('./QuestionType')
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


class TestQuestionnaire {
    constructor(parsedQuestions = []) {
        this.parsedQuestions = parsedQuestions
        this.questions = this.parsedToPrompt(parsedQuestions)
        this.totalPoints = 0
    }

    async start() {
        const test = await inquirer.prompt(this.questions);
        console.log("PARSED : ", this.parsedQuestions)
        console.log("TEST : ", test)
        this.parsedQuestions.forEach((q, idx) => {
            this.totalPoints += q.check(test[idx.toString()])
        });
        console.log("VOTRE SCORE FINAL : ", this.totalPoints, "/", this.parsedQuestions.length)
    }

    parsedToPrompt(pQs) {
        var prompts = []
        pQs.forEach((element, idx) => {
            var qtype = ''
            var choices = this.choicesFromAnswer(element.answer, element.type)
            switch (element.type) {
                case QT.EXAMPLE:
                    console.log(element.title, "\n", element.text)
                    return
                case QT.NUM_E:
                case QT.NUM_R:
                    qtype = 'number'
                    break
                case QT.VF:
                    qtype = 'confirm'
                    break
                case QT.TEXT:
                case QT.TAT:
                    qtype = 'input'
                    break
                
                
                case QT.QCU:
                    qtype = 'list'
                    break
                case QT.QCM:
                    qtype = 'checkbox'
                    break
                case QT.ASSO:
                    qtype = 'expand'
                    break
            }
            if (choices.length === 0) {
                var p = {
                    type: qtype,
                    name: idx.toString(),
                    message: element.title + "\n" + element.text
                }
                prompts.push(p)
            } else {
                var p = {
                    type: qtype,
                    name: idx.toString(),
                    message: element.title + "\n" + element.text,
                    choices: choices
                }
                prompts.push(p)
            }
        });
        return prompts
    }

    choicesFromAnswer(answers, type) {
        var choices = []
        if (![QT.ASSO, QT.QCM, QT.QCU].includes(type)) {
            return choices
        }

        
        answers.forEach((ans, idx) => {
            choices.push({
                key: alphabet[idx],
                name: ans.text
            })
        });
        return choices
    }

}

module.exports = TestQuestionnaire;