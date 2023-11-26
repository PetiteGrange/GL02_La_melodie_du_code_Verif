const Q = require('./Question.js')


class GiftParser {
    constructor(sTokenize) {
        this.parsedQuestions = []
        this.showTokenize = sTokenize
        this.errorCount = 0
    }

    tokenize(data) {
        var separator = /\r\n\s*\r\n+/
		data = data.split(separator)
		data = data.filter((val, idx) => val.trim() !== '' && val.includes('{') && val.includes('}'))
		var questions = []
        data.forEach(element => {
            var lines = element.split(/\r?\n|\r/g)
            lines = lines.filter(line => !line.trim().startsWith("//"))
            var question = lines.join("")
            questions.push(question.replace(/\r?\n|\r/g, ""))
        });
        return questions
    }

    parse(data) {
        var tData = this.tokenize(data)
        if (this.showTokenize) {
			console.log(tData)
		}
    }

    listQuestions(input) {
        
    }
}

module.exports = GiftParser;