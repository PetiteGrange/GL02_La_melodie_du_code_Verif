const Q = require('./Question.js')
const QT = require('./QuestionType.js')
const colors = require('colors');


class GiftParser {
    constructor(sTokenize) {
        this.parsedQuestions = []
        this.showTokenize = sTokenize
        this.errorCount = 0
    }

/*
Description : Découpe le texte en entrée en une liste de string contenant une question chacune
Entrée : data (String) => Contenu du fichier
Fonctionnement : Utilise les "::" marquant les titres de questions pour les séparer les unes des autres
Sortie : liste de string contenant les questions => [String]
*/
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

/*
Description : Cette fonction est le point d'entrée du parser. Elle appelle les autres fonctions du parser pour transformer le contenu du fichier donné en entrée en liste d'objets Question
Entrée : data (String) => contenu du fichier à lire
Fonctionnement : Appelle la fonction tokenize() pour découper le fichier en une liste de string contenant une question, puis appelle listQuestions() à partir de cette liste
Sortie : AUCUNE
*/
    parse(data) {
        var tData = this.tokenize(data)
        if (this.showTokenize) {
			console.log(tData)
		}
        this.listQuestions(tData)
    }

/*
Description : Appelle la fonction question() sur chaque élément de la liste *tData* donnée par parse() pour créer des objets Question
Entrée : input ([String]) => liste de questions sous format texte gift
Fonctionnement : forEach sur la liste pour appeler question() sur chaque élément
Sortie : AUCUNE
*/
    listQuestions(input) {
        input.forEach(element => {
            this.question(element);
        })
    }

/*
Description : Appelle la fonction body() pour obtenir les paramètres de l'objet Question, le créer, puis l'ajouter à la liste globale parsedQuestions
Entrée : input (String) => texte d'une question au format gift
Fonctionnement : trouve les arguments de Question() à l'aide de la fonction body, créé un objet Question et l'ajoute à parsedQuestions
Sortie : AUCUNE
*/
    question(input) {
        var args = this.body(input)
        var q = new Q(...Object.values(args))
        this.parsedQuestions.push(q)
    }

/*
Description : Est appelée pour retourner un message d'erreur si une fonctionnalité du parser ne fonctionne pas
Entrée : msg (String) => message à écrire | input (String) => partie du fichier qui pose problème
Fonctionnement : c'est un console.log()...
Sortie : AUCUNE
*/
    errMsg(msg, input) {
        this.errorCount++;
	    console.log(("Parsing Error ! on "+input+" -- msg : "+msg).red);
    }

/*
Description : retourne les arguments de l'objet Question correspondant au texte d'entrée sous forme de dictionnaire
Entrée : input (String) => texte d'une question au format gift
Fonctionnement : appelle les fonctions dédiées à chaque argument de la classe Question puis met leurs sorties dans un dictionnaire et le retourne
Sortie : {"title": titre de la question (String), "text": énoncé de la question (String), "type" type de la question (QuestionType...), "answer" réponse de la question dépend de son type, "partialCredit": si la question a des crédits partiels (boolean))}
*/
    body(input) {
        var ti = this.title(input)
        var pa = this.partialCredit(input)
        var ty = this.type(input)
        var te = this.text(input, ty)
        var an = this.answer(input, ty, pa)
        return { "title": ti, "text": te, "type": ty, "answer": an, "partialCredit": pa }
    }

/*
Description : trouve le titre d'une question à partir de son texte
Entrée : input (String) => texte d'une question au format gift
Fonctionnement : prend ce qu'il y a entre les "::"
Sortie : (String) => titre de la question
*/
    title(input) {
        const startIndex = input.indexOf('::') + 2;
        const endIndex = input.lastIndexOf('::');

        if (startIndex >= 0 && endIndex > startIndex) {
            return input.substring(startIndex, endIndex);
        } else {
            return '';
        }
    }

/*
Description : trouve l'énoncé d'une question à partir de son texte
Entrée : input (String) => texte d'une question au format gift
Fonctionnement : prend ce qui n'est ni entre "::" et entre "{}"
Sortie : (String) => énoncé de la question
*/
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

/*
Description : trouve le texte de la réponse à partir du texte de la question
Entrée : input (String) => texte d'une question au format gift
Fonctionnement : pour toutes les occurences de crochets, ajoute à une liste ce qu'il y a entre, puis retourne la liste
Sortie : [String] => liste de texte de réponses (souvent, un seul élément dans la liste. Plusieurs éléments dans le cas des textes à trous par exemple)
*/
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

/*
Description : donne le type
Entrée :
Fonctionnement :
Sortie :
*/
    type(input) {
        var matches = this.extractAnswers(input)
        var types = []

        matches.forEach(element => {
            types.push(this.findType(element))
        })

        return types
    }

/*
Description : TODO
Entrée : TODO
Fonctionnement : TODO
Sortie : TODO
*/
    findType(input) {
        const reg1 = /#.*\.\..*/ //Format NUM_R
        const reg2 = /#.*\:.*/   //Format NUM_E

        if (input == QT.EXAMPLE) {
            return QT.EXAMPLE

          } else if (input.includes("{}")) {
            return QT.TEXT;
          } else if (input.includes("~%")) {
            return QT.QCM;
          }else if (input.includes("~=")) {
            return QT.MM;

          } else if (input.includes("~") && input.includes("=")) {
            return QT.QCU;

          } else if (input.includes("=") && input.includes("->")) {
            return QT.ASSO;
          }else if (input.includes("=")) {
            return QT.TAT;
          }else if (reg1.test(input)) {
            return QT.NUM_R;

          }else if (reg2.test(input)) {
            return QT.NUM_E;

          }else if (input.includes("TRUE") || input.includes("FALSE") || input.includes("T") || input.includes("F")) {
            return QT.VF;

          }  else {
            return "error";
           }
    }

/*
Description : trouve les réponses à partir du texte d'une question au format GIFT, du type de la question, et de partialCredits
Entrée : input (String) => Texte de la réponse | type (TypeQuestion...) => type de la question | pa (boolean) => si elle a des crédits partiels
Fonctionnement : appelle extractAnswers() sur le texte d'une question, puis appelle findAnswer() sur chacune des strings retournée par extractAnswers() et retourne le résultat
Sortie : answers ([{dictionnaire de réponses dépendant du format de la question}])
*/
    answer(input, type, pa) {
        var matches = this.extractAnswers(input)
        var answers = []

        // Enlève le "#" au début des questions numériques
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

/*
Description : TODO
Entrée : TODO
Fonctionnement : TODO
Sortie : TODO
*/
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
//                console.log(elementsAccumulator)
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
        }
    }

/*
Description : Retourne si la question a des crédits partiels
Entrée : input (String) => texte de la question
Fonctionnement : extrait les réponses et si l'une d'entre elle contient le caractère '%', retourne vrai
Sortie : (boolean) => vrai si la question a des crédits partiels
*/
    partialCredit(input) {
        var ans = this.extractAnswers(input)
        ans.forEach(element => {
            if (element.includes('%')) {return true}
        })
        return false
    }

}

module.exports = GiftParser;
