const QuestionType = require('./QuestionType')

class Question {
    constructor(title = "", text, type, answer, partialCredit = false) {
        this.title = title
        this.text = text
        this.type = type
        this.answer = answer
        this.partialCredit = partialCredit
    }

    check(testAns) {
        switch (this.type) {
            case QuestionType.VF:
                return this.answer == testAns ? 1 : 0

            case QuestionType.QCU:
                for (let i = 0; i < this.answer.length; i++) {
                    const ans = this.answer[i];
                    if (testAns == ans["text"]) {
                        console.log(ans["feedback"])
                        return ans["value"];
                    }
                }
                return .0;

            case QuestionType.QCM:
                var score = .0;
                for (let i = 0; i < testAns.length; i++) {
                    const testA = testAns[i];
                    for (let j = 0; j < this.answer.length; j++) {
                        const ans = this.answer[j];
                        if (ans["text"] == testA) {
                            console.log(ans["feedback"])
                            score += ans["value"];
                        }
                    }
                }
                return score;

            case QuestionType.ASSO:
                var matches = .0;
                var count = .0;
                for (var key in testAns) {
                    count += 1;
                    matches += testAns[key] == this.answer[key] ? 1 : -1;
                }
                return matches / count;

            case QuestionType.NUM_E:
                for (let i = 0; i < this.answer.length; i++) {
                    const ans = this.answer[i];
                    const min = ans["target"] - ans["range"];
                    const max = ans["target"] + ans["range"];
                    if (testAns >= min && testAns <= max) {
                        console.log(ans["feedback"])
                        return ans["value"];
                    }
                }
                return .0;

            case QuestionType.NUM_R:
                for (let i = 0; i < this.answer.length; i++) {
                    const ans = this.answer[i];
                    if (testAns >= ans["min"] && testAns <= ans["max"]) {
                        console.log(ans["feedback"])
                        return ans["value"];
                    }
                }
                return .0;

            case QuestionType.TEXT:
                console.log("Essay question needs verification")
                return 0;

            case QuestionType.TAT:
                for (let i = 0; i < this.answer.length; i++) {
                    const element = this.answer[i];
                    if (element["text"] === testAns) {
                        console.log(element["feedback"])
                        return element["value"];
                    }
                }
                return 0;
        }
    }
}

module.exports = Question;
