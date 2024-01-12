# Projet GL02_A23 - Outil de Génération de Tests au Format GIFT

## Auteurs :
- [Othmane BEKKAL](https://github.com/0thmane1)
- [Timofey ABRAMOV](https://github.com/Tim843)
- [Camille LARDE](https://github.com/Camillelrd)
- [Alexis HEUSCHLING](https://github.com/PetiteGrange)

## Licence :
Ce projet est sous licence MIT. Veuillez consulter le fichier [LICENSE](LICENSE) pour plus de détails.

## Description :
Le projet GL02_A23 a pour objectif de faciliter la création de tests au format GIFT pour le ministère de l'éducation nationale de la République de Sealand.

## Installation :
[npm](https://www.npmjs.com/)

```bash
npm install
```

Il peut aussi être necessaire d'installer [vegalite api](https://www.npmjs.com/package/vega-lite-api)

```bash
npm install vega-lite-api
```

## Utilisation :

```bash
node . <commande> [options] [paramètres d'options] [paramètres]
```

L'éxécution des commandes se fait à l'aide de Node.


### Liste des commandes : 

#### Choix de Question.

```bash
créerQuestionnaire, cq
```
Permet à l'utilisateur de faire une sélection de questions à mettre dans un questionnaire.

#### Test du Questionnaire.

```bash
test <chemin_vers_fichier_questionnaire>
```
Permet de tester le questionnaire contenu dans le fichier donné en argument.

#### Recherche de Questions dans les Fichiers.

```bash
searchFile, sf <chemin_vers_fichier_questionnaire>
```
Permet à l'utilisateur de chercher des questions d'un certain type dans un ou des fichiers en fonction des critères spécifiés.
L'argument est le nom du fichier complet.

##### Options:

```bash
-n, --word <word>
```

Elle permet d'afficher le ou les fichiers dont le nom contient 'word'.

```bash
-c, --expression <expression>
```

Elle permet d'afficher le ou les fichiers dont le contenu contient 'expression'.


#### Affichage de Fichiers.

```bash
displayFile, df <nom du fichier>
```
Permet à l'utilisateur d'afficher un ou des fichiers selon son choix en rentrant son nom en paramètre.

#### Création de VCard.

```bash
createVCard, cvc
```
Permet à l'utilisateur de créer une carte d'identification VCard en entrant les informations de la personne dont il crée le contact.

#### Affichage de l'histogramme.

```bash
histogramme, hg
```
Permet à l'utilisateur de visualiser un histogramme des types de questions dans un questionnaire au format GIFT. Il offre également la possibilité de comparer son questionnaire avec des fichiers sélectionnés de la base de données.



## Contact :
Pour toute question ou problème, veuillez contacter un membre de l'équipe de développement aux adresses e-mail suivantes :
- Othmane BEKKAL : othmane.bekkal@utt.fr
- Timofey ABRAMOV : timofey.abramov@utt.fr
- Camille LARDE : camille.larde@utt.fr
- Alexis HEUSCHLING : alexis.heuschling@utt.fr
 
