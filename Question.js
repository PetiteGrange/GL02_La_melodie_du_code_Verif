/*
title : titre de la question (default = "")
text : énoncé de la question
type : type de la question parmi l'enum QuestionType
answers : liste des réponses sous la forme dont la forme dépend du type de question

check(answer) : retourne le nombre de points qu'on aurait si on répondait à la question par answer
*/

const QuestionType = {
    VF: 'QUESTION_VRAI_FAUX',
    // ::Q1:: 1+1=2 {T}
    QCU: 'QUESTION_CHOIX_UNIQUE',
    // ::Q2:: What's between orange and green in the spectrum? 
    // { =yellow # right; good! ~red # wrong, it's yellow ~blue # wrong, it's yellow }
    QCM: 'QUESTION_CHOIX_MULTIPLE',
    // ::Q3:: What's between 1 and 5? 
    // { =%50%2 =%50%3 ~%-100%7 }
    ASSO: 'QUESTION_ASSOCIATION',
    // ::Q4:: Which animal eats which food? { =cat -> cat food =dog -> dog food }
    NUM_E: 'QUESTION_NUMERIQUE_ECART',
    // ::Q5:: What is a number from 1 to 5? {#3:2}
    NUM_R: 'QUESTION_NUMERIQUE_RANGE',
    // ::Q6:: What is a number from 1 to 5? {#1..5}
    TEXT: 'QUESTION_TEXT'
    // ::Q7:: How are you? {}
}

class Question {
    constructor(title = "", text, type, answer, partialCredit = false) {
        if (!Object.values(QuestionType).includes(type)) {
            throw new Error('Type de question invalide');
        }

        this.title = title;
        this.text = text;
        this.type = type;
        this.answer = answer;
        this.partialCredit = partialCredit
    }

    check(testAns) {
        switch (this.type) {
            // testAns = Boolean
            // this.answer = Boolean
            case QuestionType.VF:
                return this.answer == testAns ? 1 : 0

            // testAns = [String]
            // this.answer = [{"text": String, "value": float}]
            case QuestionType.QCU:
                this.answer.forEach(ans => {
                    if (testAns == ans["text"]) {
                        return ans["value"]
                    }
                });
                return .0

            // testAns = [String]
            // this.answer = [{"text": String, "value": float}]
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
            // this.answer = [{"target": float, "range": float", "value": float}]
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
            // this.answer = [{"min": float, "max": float, "value": float}]
            case QuestionType.NUM_R:
                this.answer.array.forEach(ans => {
                    if (testAns >= ans["min"] && testAns <= ans["max"]) {
                        return ans["value"]
                    }
                });
                return .0

            case QuestionType.TEXT:
                return "Needs verification"      
        }
    }
}

export default Question