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
            if (element.includes("::")) {
                if (curQuestion != "") {
                    questions.push(curQuestion)
                    curQuestion = ""
                }
            }
            curQuestion += element
        });
        questions.push(curQuestion)
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
        var pa = this.partialCredit(input)
        var ty = this.type(input, pa)
        var te = this.text(input, ty)
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

    text(input, ty) {
        let occurrence = 0;
        const bracketRegex = /\{[^}]+\}/g;
        const titleRegex = /::[^:]+::/g;

        const stringWithoutTitle = input.replace(titleRegex, '').trim();

        return stringWithoutTitle.replace(bracketRegex, match => {
            occurrence++;
            if (ty == QT.TAT) {
                return `->${occurrence}<-`;
            } else {
                return ""
            }
        }).trim();
    }

    extractAnswers(input) {
        const regex = /{([^}]+)}/g
        const matches = []
        let match
        
        while ((match = regex.exec(input)) !== null) {
            matches.push(match[1])
        }

        // EXAMPLE
        if (matches.length == 0) {
            return [QT.EXAMPLE]
        }

        return matches
    }

    findType(input, pa) {
        if (input == QT.EXAMPLE) {
            return QT.EXAMPLE
        }

        if (input[0] == "#") {
            if (input.includes(":")) {
                return QT.NUM_E
            } else if (input.includes("..")) {
                return QT.NUM_R
            }
        }

        if (input.length == 1) {
            return QT.VF
        }

        if (input.includes("->")) {
            return QT.ASSO
        }

        if (input.includes("=")) {
            return pa ? QT.QCM : QT.QCU
        } 

        return QT.TEXT
    }

    type(input, pa) {
        var matches = this.extractAnswers(input)
        var types = []

        matches.forEach(element => {
            types.push(this.findType(element, pa))
        })

        return types
    }

    answer(input, type, pa) {
        var matches = this.extractAnswers(input)
        var answers = []

        matches.forEach((element, idx) => {
            if (element[0] == "#") {
                matches[idx] = element.substring(1)
            }
        })

        matches.forEach(element => {
            var a = this.findAnswer(element, type, pa)
            answers.push(a)
        })

        return answers
    }

    static keyCaracters = ["=", "~"]
    findAnswer(input, type, pa) {
        // Lit le contenu entre crochets envoyé dans "txt", et retourne les différentes réponses (vraies et fausses) envisagées ainsi que leur feedback s'il existe
        function read(txt, accumulator = "", currentElement = "", elementsAccumulator = [], isFeedback = false, feedback = "") {
            if (txt.length === 0) {
                var finalElement = {}
                finalElement[currentElement] = accumulator
                finalElement["feedback"] = feedback
                elementsAccumulator.push(finalElement)
                return elementsAccumulator
            }

            var curCar = txt[0]

            if (GiftParser.keyCaracters.includes(curCar)) {
                if (accumulator != "") {
                    var element = {}
                    element[currentElement] = accumulator
                    element["feedback"] = feedback
                    elementsAccumulator.push(element)
                    accumulator = ""
                    feedback = ""
                    isFeedback = false
                }
                currentElement = curCar
            } else {
                if (curCar == "#") {isFeedback = true}
    
                if (!isFeedback) {
                    accumulator += curCar
                } else {
                    feedback += curCar
                }
            }

            return read(txt.substring(1), accumulator, currentElement, elementsAccumulator, isFeedback, feedback)
        }

        switch (type) {
            // testAns = Boolean
            // this.answer = Boolean
            case QT.VF:
                return input.includes("T")

            // testAns = String
            // this.answer = ""
            case QT.TEXT:
                return ""
            
            default:
                return read(input)

            // // testAns = String
            // // this.answer = [{"text": String, "value": float, "feedback": String}]
            // case QT.QCU:

            // // testAns = [String]
            // // this.answer = [{"text": String, "value": float, "feedback": String}]
            // case QT.QCM:

            // // testAns = {"Question1": "Réponse1", "Question2": "Réponse2"}
            // // this.answer = {"Question1": "Réponse1", "Question2": "Réponse2"}
            // case QT.ASSO:

            // // testAns = float
            // // this.answer = [{"target": float, "range": float", "value": float, "feedback": String}]
            // case QT.NUM_E:

            // // testAns = float
            // // this.answer = [{"min": float, "max": float, "value": float, "feedback": String}]
            // case QT.NUM_R:

            // // testAns = [String]
            // // this.answer = [{"text": String, "value": float}]
            // case QT.TAT:


        }
    }

    partialCredit(input) {
        return input.includes('%')
    }

}

module.exports = GiftParser;