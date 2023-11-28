const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require ('./Question.js');
//const choixQuestions = require ('./choixQuestion.js');

const path = require('path');
const directoryPath = path.join('data');



questions
.command('decomposer', 'deccompose en objet')
.action(() => {
  const directoryPath = 'data'; // Assurez-vous de spécifier le bon chemin
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
        resultObject["question"] = question;
        resultObject["answer"] = answer;
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



/*
  const giftObject = convertGIFTtoObject("::EM U5 p34 Voc1.0::Complete sentences with the words in the list. \n ::EM U4 p32 Review 2 OpenCloze::Read the text below and think of the word which best fits each gap. Use only one word in each gap.");
  console.log(giftObject);
  console.log("LOLO");
  */

