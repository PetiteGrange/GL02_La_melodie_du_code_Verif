/*
title : titre de la question (default = "")
text : énoncé de la question
type : type de la question parmi l'enum QuestionType
answers : liste des réponses dont la forme dépend du type de question

check(testAns) : retourne le nombre de points qu'on aurait si on répondait à la question par testAns
*/

const QuestionType = require('./QuestionType')

class Question {
    constructor(title = "", text, type, answer, partialCredit = false) {
        // if (!Object.values(QuestionType).includes(type)) {
        //     throw new Error('Type de question invalide')
        // }

        this.title = title
        this.text = text
        this.type = type
        this.answer = answer
        this.partialCredit = partialCredit
    }

    check(testAns) {
        switch (this.type) {
            // testAns = Boolean
            // this.answer = Boolean
            case QuestionType.VF:
                return this.answer == testAns ? 1 : 0

            // testAns = String
            // this.answer = [{"text": String, "value": float, "feedback": String}]
            case QuestionType.QCU:
                this.answer.forEach(ans => {
                    if (testAns == ans["text"]) {
                        return ans["value"]
                    }
                });
                return .0

            // testAns = [String]
            // this.answer = [{"text": String, "value": float, "feedback": String}]
            case QuestionType.QCM:
                var score = .0
                testAns.array.forEach(testA => {
                    this.answer.array.forEach(ans => {
                        if (ans["text"] == testA) {
                            score += ans["value"]
                        }
                    });
                });
                return score

            // testAns = {"Question1": "Réponse1", "Question2": "Réponse2"}
            // this.answer = {"Question1": "Réponse1", "Question2": "Réponse2"}
            case QuestionType.ASSO:
                var matches = .0
                var count = .0
                for (var key in testAns) {
                    count += 1
                    matches += testAns[key] == this.answer[key] ? 1 : -1
                }
                return matches / count

            // testAns = float
            // this.answer = [{"target": float, "range": float", "value": float, "feedback": String}]
            case QuestionType.NUM_E:
                this.answer.array.forEach(ans => {
                    var min = ans["target"] - ans["range"]
                    var max = ans["target"] + ans["range"]
                    if (testAns >= min && testAns <= max) {
                        return ans["value"]
                    }
                });
                return .0

            // testAns = float
            // this.answer = [{"min": float, "max": float, "value": float, "feedback": String}]
            case QuestionType.NUM_R:
                this.answer.array.forEach(ans => {
                    if (testAns >= ans["min"] && testAns <= ans["max"]) {
                        return ans["value"]
                    }
                });
                return .0
            
            // testAns = String
            // this.answer = ""
            case QuestionType.TEXT:
                return "Needs verification"      

            // testAns = [String]
            // this.answer = [{"text": String, "value": float}]
            case QuestionType.TAT:
                var score = .0
                testAns.array.forEach((testA, idx) => {
                    if (this.answer[idx] == testA) {
                        score += this.answer[idx].value
                    }
                });
                return score
        }
    }
}

module.exports = Question;