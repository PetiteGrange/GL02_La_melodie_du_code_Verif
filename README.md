# GL02_La_melodie_du_code

Guide d'utilisation du logiciel pour pouvoir exécuter les différentes spécifications fonctionnelles :

Spec 1 :

Spec 2 : "L’enseignant sélectionne plusieurs questions en respectant les règles données."
-> S'effectue en lançant la commande "node . créerQuestionnaire".
Attention, si la commande est lancée plusieurs fois, le dernier questionnaire ecrasera les autres.
L'utilisateur aura accès à la liste des fichiers de la base de données afin de choisir lequel ouvrir. Il aura ensuite accès à la liste des questions présentes dans le fichier sélectionné afin d'en choisir une à ajouter ou retirer au questionnaire.
Par défaut, lorsqu'une question est sélectionnée, le programme demande à l'utilisateur s'il veut l'ajouter au questionnaire.
Si la question est déjà dans le questionnaire, le programme demande à l'utilisateur s'il veut la retirer du questionnaire.
Répondre "Non" à l'une de ces deux questions ne modifie pas le questionnaire.
Un choix "Terminer" est avec la liste des fichiers pour permettre à l'utilisateur de terminer la sélection de questions.
Lorsque l'utilisateur appuie sur "Terminer", le programme vérifie si le questionnaire est conforme aux règles données (Spec 4). Si ce n'est pas le cas, l'utilisateur est notifié et infité à modifier sa sélection.
Une fois le questionnaire conforme et la sélection terminée, le programme propose à l'utilisateur de vérifier s'il lui convient. Si non, il peut le modifier.

Spec 3 :

Spec 4 : "Vérifier qu’un ensemble de questions respecte la qualité des données soit, l’ensemble comporte entre 15 et 20 questions et qu’elles sont toutes uniques."
-> S'effectue automatiquement pendant la réalisation de la Spec 2.

Spec 5 :

Spec 6 :

Spec 7 :

Spec 8 :
