# GL02_La_melodie_du_code

### README - GL02_La_melodie_du_code

Description : Le présent logiciel permet d'exécuter les spécifications du cahier des charges du groupe COAT.
Un parseur du format GIFT permet de transformer des fichiers rédigés conformément aux formats GIFT en objets Javascript.
Les fichiers de test doivent être placés dans le dossier "data" et respecter le format GIFT (donné dans le cahier des charges).


### Installation

$ npm install

### Utilisation :

$ node . <command>

<command> : choixQuestion

Permet à l'utilisateur de faire une sélection de questions à mettre dans un questionnaire.

<command> : check                                                     (exemple du TD)

-h or --help 	:	 display the program help                             (exemple du TD)
-t or --showTokenize :	 display the tokenization result              (exemple du TD)
-s or --showSymbols :	 display each step of the analysis              (exemple du TD)

Optional parameters have to be before the mandatory file parameter.   (exemple du TD)


<command> : searchFile (alias sf)

Permet à l'utilisateur de chercher des questions d'un certain type dans un ou des fichiers en fonction des critères suivants : 

    - le nom complet du ou des fichiers : 
        - argument [name...] -> entrer le nom du ou des fichiers, séparés par un espace 

    - une partie du nom du ou des fichiers :
        - option -n -> entrer une partie du nom du ou des fichiers, entre ''

    - une partie du contenu du ou des fichiers :
        - option -c -> entrer une partie du contenu du ou des fichiers, entre ''

Une fois dans le ou les fichiers choisis, l'utilisateur devra choisir un type de question qu'il voudra afficher. Il suffit de faire défiler avec les flèches directionnelles, 
et d'appuyer sur entrer une fois sur le type choisi.


<command> : displayFile (alias df)

Permet à l'utilisateur d'afficher un ou des fichiers selon son choix : 

    - le nom complet du ou des fichiers : 
        - argument [file...] -> entrer le nom du ou des fichiers, séparés par un espace

    - option -a -> affiche l'entiereté des fichiers


<command> : createVCard (alias cvc)

Permet à l'utilisateur de créer une carte d'identification VCard, en entrant les informations de la personne dont il crée le contact.


### Liste des contributeurs
Aurélien  (aurelien.julie@utt.fr)
Tibault   (tibault.bisagni@utt.fr)
Marian    (marian.vigneron@utt.fr)
Ambrine   (ambrine.bencheikh@utt.fr)
