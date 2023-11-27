const Q = require('./Question.js')
const QT = require('./QuestionType.js')
const colors = require('colors');


class GiftParser {
    constructor(sTokenize) {
        this.parsedQuestions = []
        this.showTokenize = sTokenize
        this.errorCount = 0
    }

    tokenize(data) {
        var separator = /\r\n/
		data = data.split(separator)
		data = data.filter((val, idx) => val.trim() !== '' && !val.trim().startsWith("//"))
		var questions = []
        var curQuestion = ""
        data.forEach(element => {
            curQuestion += element
            if (element.includes("}")) {
                questions.push(curQuestion)
                curQuestion = ""
            }
        });
        return questions
    }

    parse(data) {
        var tData = this.tokenize(data)
        if (this.showTokenize) {
			console.log(tData)
		}
        this.listQuestions(tData)
    }

    listQuestions(input) {
        input.forEach(element => {
            this.question(element);
        })
    }

    question(input) {
        var args = this.body(input)
        var q = new Q(...Object.values(args))
        this.parsedQuestions.push(q)
    }

    errMsg(msg, input) {
        this.errorCount++;
	    console.log(("Parsing Error ! on "+input+" -- msg : "+msg).red);
    }

    body(input) {
        var ti = this.title(input)
        var te = this.text(input)
        var pa = this.partialCredit(input)
        var ty = this.type(input, pa)
        var an = this.answer(input, ty, pa)
        return { "title": ti, "text": te, "type": ty, "answer": an, "partialCredit": pa }
    }

    title(input) {
        const startIndex = input.indexOf('::') + 2;
        const endIndex = input.lastIndexOf('::');
    
        if (startIndex >= 0 && endIndex > startIndex) {
            return input.substring(startIndex, endIndex);
        } else {
            return '';
        }
    }

    text(input) {
        let occurrence = 0;
        const bracketRegex = /\{[^}]+\}/g;
        const titleRegex = /::[^:]+::/g;

        const stringWithoutTitle = input.replace(titleRegex, '').trim();

        return stringWithoutTitle.replace(bracketRegex, match => {
            occurrence++;
            return `->${occurrence}<-`;
        }).trim();
    }

    extractAnswers(input) {
        const regex = /{([^}]+)}/g
        const matches = []
        let match
        
        while ((match = regex.exec(input)) !== null) {
            matches.push(match[1])
        }

        if (matches.length == 0) {
            this.errMsg("No answer", input);
            return null
        }

        return matches
    }

    findType(input, pa) {
        if (input.length == 1) {
            return QT.VF
        }

        if (input.includes("->")) {
            return QT.ASSO
        }

        if (input.includes("=")) {
            return pa ? QT.QCM : QT.QCU
        } else if (input.includes(":")) {
            return QT.NUM_E
        } else if (input.includes("..")) {
            return QT.NUM_R
        }

        return QT.TEXT
    }


    type(input, pa) {
        var matches = this.extractAnswers(input)
        var types = []

        matches.forEach(element => {
            types.push(this.findType(element))
        })

        return types
    }

    answer(input, type, partialCredit) {
        var matches = this.extractAnswers(input)
        var answers = []

        matches.forEach(element => {
            answers.push(this.findAnswer(element, type, partialCredit))
        })
    }

    findAnswer(input, type, partialCredit) {
        switch (type) {
            // testAns = Boolean
            // this.answer = Boolean
            case QT.VF:
                return input.includes("T")

            // testAns = String
            // this.answer = ""
            case QT.TEXT:
                return ""
            
            var list = input.split(/=|~/).filter(segment => segment !== '')
            // testAns = String
            // this.answer = [{"text": String, "value": float, "feedback": String}]
            case QT.QCU:
                var answers = []
                list.forEach(ans => {
                    var text = ""
                    var value = .0
                    var feedback = ""
                    if (ans.includes("#")) {
                        feedback = ans.split('#')[1].trim()
                    } else { feedback = ""}


                    if (!partialCredit) {

                    } else {

                    }
                })

            // testAns = [String]
            // this.answer = [{"text": String, "value": float, "feedback": String}]
            case QT.QCM:

            // testAns = {"Question1": "Réponse1", "Question2": "Réponse2"}
            // this.answer = {"Question1": "Réponse1", "Question2": "Réponse2"}
            case QT.ASSO:

            // testAns = float
            // this.answer = [{"target": float, "range": float", "value": float, "feedback": String}]
            case QT.NUM_E:

            // testAns = float
            // this.answer = [{"min": float, "max": float, "value": float, "feedback": String}]
            case QT.NUM_R:

        }
        return null
    }

    partialCredit(input) {
        return input.includes('%')
    }
}

module.exports = GiftParser;