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
            case QT.QCU, QT.QCM:
                question.answer.forEach(element => {
                    if (element.value) {
                        fileString += "="
                    } else {
                        fileString += "~"
                    }
                    fileString += element.text
                    if (!element.feedback === "") {
                        fileString += `#${element.feedback}`
                    }
                    
                })
        }
        fileString += "}"
    });
}