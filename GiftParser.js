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
        console.log("INPUT : ", input)
        var args = this.body(input)
        var q = new Q(...Object.values(args))
        console.log(q)
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
        const regex2 = /{}/g
        const matches = []
        let match
        
        while ((match = regex.exec(input)) !== null) {
            
            matches.push(match[1])
        }

        //Si les accolades sont vides
        if (regex2.test(input)) {
            return [QT.TEXT]
        }
        
        // EXAMPLE
        else if (matches.length == 0) {
            return [QT.EXAMPLE]
        }

        return matches
    }

    findType(input, pa) {
        if (input === QT.TEXT) {
            return QT.TEXT
        } else if (input === QT.EXAMPLE) {
            return QT.EXAMPLE
        } else if (input.includes("->")) {
            return QT.ASSO
        } else if (input.includes("TRUE") || input.includes("FALSE") || input.includes("T") || input.includes("F")) {
            return QT.VF
        } else if (input[0] === "#") {
            const hasDoubleDot = /\.\./.test(input);
            const hasTripleDotOrMore = /\.{3,}/.test(input);
            if (hasDoubleDot && !hasTripleDotOrMore) {
                return QT.NUM_R
            } else {
                return QT.NUM_E
            }
        } else if (!input.includes("~")) {
            return QT.TAT
        } else if (pa) {
            return QT.QCM
        }
        return QT.QCU
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
            console.log(type[0], " : ", a)
            answers.push(a)
        })

        return answers
    }

    static keyCaracters = ["=", "~"]
    findAnswer(input, type, pa) {
        // Lit le contenu entre crochets envoyé dans "txt", et retourne les différentes réponses (vraies et fausses) envisagées ainsi que leur feedback s'il existe
        function read(txt, accumulator = "", currentElement = "", elementsAccumulator = [], currentField = "main", feedback = "", partialCredit = "") {
            if (txt.length === 0) {
                var finalElement = {}
                finalElement[currentElement] = accumulator
                finalElement["feedback"] = feedback
                if (pa) {
                    if (partialCredit === "") {
                        finalElement["partialCredit"] = 1.0
                    } else {
                        finalElement["partialCredit"] = parseFloat(partialCredit) / 100
                    }
                }
                elementsAccumulator.push(finalElement)
                return elementsAccumulator
            }

            var curCar = txt[0]

            if (GiftParser.keyCaracters.includes(curCar)) {
                if (accumulator.trim() != "") {
                    var element = {}
                    element[currentElement] = accumulator
                    element["feedback"] = feedback
                    elementsAccumulator.push(element)
                    accumulator = ""
                    feedback = ""
                    currentField = "main"
                }
                currentElement = curCar
            } else {
                if (curCar === "#") {
                    currentField = "feedback"
                } else if (curCar === "%") {
                    if (currentField === "main") {
                        currentField = "partialCredit"
                    } else {
                        currentField = "main"
                    }
                } else {
                    if (currentField === "main") {
                        accumulator += curCar
                    } else if (currentField === "feedback") {
                        feedback += curCar
                    } else if (pa && currentField === "partialCredit") {
                        partialCredit += curCar
                    }
                }
            }

            return read(txt.substring(1), accumulator, currentElement, elementsAccumulator, currentField, feedback, partialCredit)
        }

        var read_result = read(input)

        switch (type[0]) {
            // testAns = Boolean
            // this.answer = Boolean
            case QT.VF:
                return input.includes("T")

            // testAns = String
            // this.answer = ""
            case QT.TEXT:
                return ""
            
            case QT.ASSO:
                var result = []
                read_result.forEach(element => {
                    var split = element["="].split('->').map(str => str.trim())
                    let left = split[0]
                    let right = split[1]
                    result.push({
                        [left]: right
                    })
                })
                return result
            
            case QT.NUM_E:
                var result = []
                read_result.forEach(element => {
                    var split = ""
                    var key = ""
                    var value = 1
                    if ("=" in element) {
                        key = "="
                    } else {
                        key = "~"
                        value = 0
                    }

                    if ("partialCredit" in element) {
                        value = element["partialCredit"]
                    }

                    var split = element[key].split(":").map(str => str.trim())
                    let target = parseFloat(split[0])
                    let range = parseFloat(split[1])
                    result.push({
                        target: target,
                        range: range,
                        value: value,
                        feedback: element["feedback"]
                    })
                })
                return result

            case QT.NUM_R:
                var result = []
                read_result.forEach(element => {
                    var split = ""
                    var key = ""
                    var value = 1
                    if ("=" in element) {
                        key = "="
                    } else {
                        key = "~"
                        value = 0
                    }

                    if ("partialCredit" in element) {
                        value = element["partialCredit"]
                    }

                    var split = element[key].split("..").map(str => str.trim())
                    let min = parseFloat(split[0])
                    let max = parseFloat(split[1])
                    result.push({
                        min: min,
                        max: max,
                        value: value,
                        feedback: element["feedback"]
                    })
                })
                return result
                
            
            default:
                return read_result

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
        var ans = this.extractAnswers(input)
        for (let i = 0; i < ans.length; i++) {
            if (ans[i].includes('%')) {
                return true;
            }
        }
        return false
    }

}

module.exports = GiftParser;