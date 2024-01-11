const QT = require('./QuestionType')
const inquirer = require('inquirer');
const fs = require('fs');

async function objectsToGIFT(objects) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'fileName',
            message: 'Entrez le nom de votre questionnaire:'
        }
    ]);
    const fileName = answers.fileName

    fileString = ""
    objects.forEach(question => {
        fileString += `::${question.title}::\n`
        fileString += `${question.text}\n`
        fileString += "{"
        switch (question.type) {
            case QT.VF:
                if (question.answer) {
                    fileString += "T"
                } else {
                    fileString += "F"
                }
                break
            case QT.QCU:
            case QT.QCM:
                console.log("test")
                question.answer.forEach(element => {
                    console.log(element)
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
    
    fs.writeFile(`./data/${fileName}.gift`, fileString, err => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`File ${fileName}.gift has been saved.`)
    })
}

module.exports = objectsToGIFT;