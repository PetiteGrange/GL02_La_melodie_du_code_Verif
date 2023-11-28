const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require ('./Question.js');
//const choixQuestions = require ('./choixQuestion.js');

const path = require('path');
const directoryPath = path.join('data');



questions
.command('decomposer', 'deccompose en objet')
.action(() => {
    const giftObject = [];
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            //console.log(file + '\n\n');
            filePath = path.join('data', file);
            fs.readFile(filePath, 'utf-8', function(err, content) {
              if (err) {
                return console.log('Unable to scan file '+file+': '+err+'\n');
              }
              
              giftObject.push(convertGIFTtoObject(content));
              console.log(giftObject);
              
              
            })
        })
        
        
        ;
    });
    //console.log(giftObject);
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

