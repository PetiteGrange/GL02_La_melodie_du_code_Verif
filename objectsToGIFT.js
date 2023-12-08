const QT = require('./QuestionType')

function objectsToGIFT(objects) {
    fileString = ""
    objects.forEach(question => {
        fileString += `::${question.title}::\n}`
        fileString += `${question.text}\n}`
        fileString += "{"
        switch (question.type) {
            case QT.VF:
                if (question.answer) {
                    fileString += "T"
                } else {
                    fileString += "F"
                }
                break
            case QT.QCU, QT.QCM:
                question.answer.forEach(element => {
                    if (element.value == 1) {
                        fileString += "="
                    } else {
                        fileString += "~"
                    }
                    fileString += element.text
                    if (!element.feedback === "") {
                        fileString += `#${element.feedback}`
                    }
                    
                })
                break
            case QT.ASSO:
                for (let key in question.answer) {
                    fileString += "=" + key + "->" + question.answer[key]
                }
                break
            case QT.NUM_E:
                fileString += "#"
                question.answer.forEach(element => {
                    if (element["value"] == 1) {
                        fileString += "="
                    } else {
                        fileString += "~"
                    }
                    fileString += element["target"] + ":" + element["range"]
                })
                break
            case QT.NUM_R:
                fileString += "#"
                question.answer.forEach(element => {
                    if (element["value"] == 1) {
                        fileString += "="
                    } else {
                        fileString += "~"
                    }
                    fileString += element["min"] + ".." + element["max"]
                })
                break
        
            case QT.TAT:
                question.answer.forEach(element => {
                    if (element["value"] == 1) {
                        fileString += "="
                    } else {
                        fileString += "~"
                    }
                    fileString += element["text"]
                })
                break
        }
        fileString += "}\n"
    });
    console.log(fileString)
}

module.exports = objectsToGIFT;