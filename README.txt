# GL02_La_melodie_du_code

### README - GL02_La_melodie_du_code

Description : Le présent logiciel permet d'exécuter les spécifications du cahier des charges du groupe COAT.
Un parseur du format GIFT permet de transformer des fichiers rédigés conformément aux formats GIFT en objets Javascript.
Les fichiers de test doivent être placés dans le dossier "data" et respecter le format GIFT (donné dans le cahier des charges).


### Installation

$ npm install

### Utilisation :

$ node . <command>

<command> : choixQuestion (alias cq)

Permet à l'utilisateur de faire une sélection de questions à mettre dans un questionnaire.


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


<command> : histogramme (alias hg)

Aucun paramètre d'entrée

Permet à l'utilisateur d'ouvrir une page HTML dans laquel il pourra sélectionner son questionaire (boutton: "choisir un fichier") au format .gift afin de visualiser à travers un histogramme le type des différentes questions qui l'a compose.
Il pourra égallement afficher l'histogramme de un ou plusieurs questionaires de la base de donnée. (boutton: "Select. fichiers")
Il pourra enfin comparer son questionaire avec les fichiers selectionnées de la base en appuyant sur le boutton "comparer". Attention, il faut forcément avoir selectionné au moins un fichier dans chaque groupe pour pouvoir comparer.
La comparaison affiche sur la page HTML un histogramme avec la somme des deux précédents histogrammes ( Bleu : votre queestionaire, orange: les questions selectionnées de la base de données)
Il renvoit égallement le nombre de questions dans chaque ensemble sans prendre en compte les exemples.
Il affiche ensuite la valeur relative de question de votre questionaire par rapport à la base de questionaires selectionnée.

Par exemple si votre questionaire à 5 QCM et 1 question Association et l'ensemble des questions séléctionées a 20 texte à trous et 2 QCM il affichera:

QCM  : + 3 (car votre questionaire à 3 questions de ce type en + par rapport à la banque de questionnaires choisies)
question Association : +1
texte à trous : -20 (car votre questionaire à 20 questions de ce type en - par rapport à la banque de questionnaires choisies)
Et les autres à 0



### Liste des contributeurs
Aurélien  (aurelien.juille@utt.fr)
Tibault   (tibault.bisagni@utt.fr)
Marian    (marian.vigneron@utt.fr)
Ambrine   (ambrine.bencheikh@utt.fr)
