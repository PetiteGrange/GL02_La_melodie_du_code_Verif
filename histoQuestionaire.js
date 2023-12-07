const fs = require('fs');
const questions = require("@caporal/core").default;
const Question = require('./Question.js');
//const QuestionType = require('./QuestionType.js');
//const GiftParser = require('./GiftParser.js')
const { decomposer,    supprimerBalisesHTML,    convertGIFTLinetoObject,    typeQuestion,    convertGIFTtoObject  }  = require('./giftToObject.js'); //maybe renvoit pas qu'un objet
//const main = require('./main.js');
const vegaLiteApi = require('vega-lite-api');
const vegaLite = require('vega-lite');
//const vegaEmbed = require('vega-embed');
//const vegaLiteExport = require('vega-lite-export');
const path = require('path');


questions
    .command('histogramme', "Affiche l'Histogramme d'un questionnaire")
    
    //.option('-s, --AFaire', 'avec couleur?', { validator : questions.BOOLEAN, default: false })
    //.option('-t, --Afaire2', 'bidule chouette', { validator: questions.BOOLEAN, default: false })
    .action(({args, options, logger}) => {
        
        //histogramme(args.questionaire) ;
        //console.log(a);
        openIndexHtml();

    });

questions.run(process.argv.slice(2));


function histogramme(questionaire) {
  openIndexHtml();
  /*
    //const questionary = decomposer(questionaire) ;
    const questionary = object(questionaire) ;
    console.log("\r\n\r\n"+JSON.stringify(questionary)+"  rika")
    
    donneeQuestionaire = convertToJSON(questionary);
    
    //openIndexHtml();
    //console.log(JSON.parse(donneeQuestionaire).data.values)
    obJSon= JSON.parse(donneeQuestionaire).data.values
    //console.log( JSON.stringify(obJSon))

    return obJSon;*/
}

function convertToJSON(tabQuestionaire)  {
    /* Tout concatener 
      
      valuesJSON.forEach(question => {
        console.log(question.type)
        console.log(question.answer)
      } )
      
      
      */
      valuesJSONComplet =tabQuestionaire.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue)
      })

      valuesJSON = [];

      valuesJSONComplet.forEach(question => {
        valuesJSON.push({"Type Question": question.type[0]})
      } )

      //console.log(valuesJSON)

    const objJson= {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        "data": {        
            "values": valuesJSON
        },
      "mark": "bar",
      "encoding": {
        "x": {"field": 'Type Question', "type": "nominal"},
        "y": {"aggregate" : "count", "type": "quantitative"}
      }
    }
    
    /*
    const spec = vegaLiteApi
    .markBar()
    .data(tabQuestionaire)
    .encode(
      vegaLiteApi.x().fieldN('Type Question').type('nominal'),
      vegaLiteApi.y().count()
    )
    .toObject();
        */

//console.log(JSON.stringify(objJson, null, 2))
   return JSON.stringify(objJson); 
}


const openIndexHtml = async () => {
    const path = require('path');
    const { exec } = require('child_process');
  
    // Chemin complet vers le fichier index.html
    const indexPath = path.join('index.html');
  
    // Ouvrir le fichier index.html dans le navigateur par défaut
    switch (process.platform) {
      case 'darwin': // macOS
        exec(`open ${indexPath}`);
        break;
      case 'win32': // Windows
        exec(`start ${indexPath}`);
        break;
      default: // Linux
        exec(`xdg-open ${indexPath}`);
    }
  };

  

  function object(data) {
    

    const giftObject = [];
    const directoryPath =data;

    try {
        const files = fs.readdirSync(directoryPath);

        files.forEach(file => {
           const filePath = path.join(directoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');

          //console.log(typeof content)
          giftObject.push(questUnitaire(content))
        });

        //console.log(giftObject);
    } catch (err) {
     console.error('Error: ' + err);
    }
  //console.log(giftObject);
   return giftObject;
}






function questUnitaire(file) {
    var analyzer = new GiftParser(false);          
          
          analyzer.parse(file);
          //analyzer.parsedQuestions;

    return analyzer.parsedQuestions;
}