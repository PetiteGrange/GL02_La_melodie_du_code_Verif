const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require('./Question.js');
const QuestionType = require('./QuestionType.js');

const path = require('path');
const directoryPath = path.join('data');



questions
.command('decomposer', 'deccompose en objet')
.argument("<file>", "chemin d'accès")
.action(({args}) => {
  const directoryPath = args.file; // Assurez-vous de spécifier le bon chemin
  console.log(args.file);
  const giftObject = [];

  try {
      const files = fs.readdirSync(directoryPath);

      files.forEach(file => {
          const filePath = path.join(directoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');

          giftObject.push(convertGIFTtoObject(content));
      });

      //console.log(giftObject);
  } catch (err) {
      console.error('Error: ' + err);
  }
    console.log(giftObject);
    return giftObject;
  })

questions.run(process.argv.slice(2));




function convertGIFTLinetoObject(giftText) {
  const resultObject = {};
  if(giftText.includes("::")) {
      const units = giftText.split("::");
  

      const question = units[1].trim();//.trim permet d'enlever les espaces de fin
      const answer = units[2].trim();
      const type = typeQuestion(answer);
      resultObject["question"] = question;
      resultObject["answer"] = answer;
      resultObject["typeQuestion"] = type;

    } else {
      resultObject["Autre"] = giftText;
    }
        
  

  return resultObject;
}


function convertGIFTtoObject(giftText) {
  const units = giftText.split("\r\n\r\n").map((x) => x.trim()).map((x) => supprimerBalisesHTML(x));
  
  
  //Si $ dans un doc A FAIREEEEEEEEEEEEEEEE
  if (false) {
    const titre = units[0];
    //on supprime de la liste le titre
    units = units.splice(0,1); 
  }
  
  const resultObject = [];
  units.forEach((unit) => {
    resultObject.push(convertGIFTLinetoObject(unit));
  })
  
  
      
        
  

  return resultObject;
}

function supprimerBalisesHTML(chaine) {
  return chaine.replace(/<\/?[^>]+(>|$)/g, "");
}


function typeQuestion(chaine) {
  const reg1 = /\{#.*\.\..*\}/ //Format NUM_R
  const reg2 = /\{#.*\:.*\}/   //Format NUM_E
  let type = QuestionType.TEXT;


  if (chaine.includes("{}")) {
    type = QuestionType.TEXT;
  } else if (chaine.includes("~%")) {
    type = QuestionType.QCM;
  }else if (chaine.includes("~=")) {
    type = QuestionType.MW;

  } else if (chaine.includes("~") && chaine.includes("=")) {
    type = QuestionType.QCU;

  } else if (chaine.includes("{TRUE}") || chaine.includes("{FALSE}") || chaine.includes("{T}") || chaine.includes("{F}")) {
    type = QuestionType.VF;

  } else if (chaine.includes("{") && chaine.includes("=")&& chaine.includes("->")) {
    type = QuestionType.ASSO;

  }else if (chaine.includes("{") && chaine.includes("=")&& !chaine.includes("~")) {
    type = QuestionType.SA;

  }else if (reg1.test(chaine)) {    
    type = QuestionType.NUM_R;

  }else if (reg2.test(chaine)) {
    type = QuestionType.NUM_E;

  } else {
      type = "Description";
   }


  return type;
}

module.exports = questions,supprimerBalisesHTML, convertGIFTLinetoObject, typeQuestion,convertGIFTtoObject;
//module.exports = questions;