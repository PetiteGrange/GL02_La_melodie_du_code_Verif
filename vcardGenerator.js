const fs = require('fs');  //require fs pour lire les fichiers
const path = require('path');  //require path pour avoir un chemin absolu
const readline = require('readline');  //require readline pour pouvoir lire les entrées de l'utilisateur 

/*
Description : Fonction de vérification du format d'un email
Entrée : email (String) => email à vérifier
Fonctionnement : compare les caractères de l'email avec ceux acceptés et/ou nécessaires
Sortie : Booleen
*/

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/*
Description : Fonction de vérification du format d'un numéro de téléphone
Entrée : phoneNumber (Int) => numéro de téléphone à vérifier
Fonctionnement : vérifie que le numéro ne comporte que des chiffres et pas de lettres
Sortie : Booleen
*/

function isValidPhoneNumber(phoneNumber) {
    return !isNaN(phoneNumber);
}

/*
Description : Créé une VCard à partir des informations entrées par l'utilisateur
Entrée : firstName (String) => prénom de l'utilisateur
Entrée : lastName (String) => nom de l'utilisateur
Entrée : email (String) => email de l'utilisateur
Entrée : phoneNumber (Int) => prénom de l'utilisateur
Entrée : role (String) => role de l'utilisateur (professeur, étudiant etc...)
Entrée : departement (String) => departement d'appartenance de l'utilisateur (langue, science etc...)
Entrée : outputDirectory (String) => dossier dans lequel les VCard sont créées
Fonctionnement : crée la VCard en fonction des infos rentrées par l'utilisateur, selon le format de VCard classique et la stocke dans le dosser choisi
Sortie : Aucune
*/

function createTeacherVCard(firstName, lastName, email, phoneNumber, role, department, outputDirectory) {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${firstName} ${lastName}
N:${lastName};${firstName};;;
EMAIL:${email}
TEL:${phoneNumber}
ROLE:${role}
DEPARTMENT:${department}
END:VCARD`;

    const outputFolderPath = path.join(outputDirectory, 'vCards');
    const outputPath = path.join(outputFolderPath, `${firstName}_${lastName}_contact.vcf`);

    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }

    fs.writeFileSync(outputPath, vCardContent);
    console.log(`Fichier vCard créé avec succès : ${outputPath}`);
}

/*
Description : Fonction de demande d'une information
Entrée : question (String) => numéro de téléphone à vérifier
Entrée : validationFunction (function) => fonction de validation d'email ou de numéro de téléphone
Entrée : callBack (function) => apelle recursivement askQuestion ou une autre fonction
Fonctionnement : demande une information, puis apelle a  nouveau la fonction recursivement,  jusqu'a ce que toutes les informations nécessaires à la VCard soient apportées
Sortie : Aucune
*/

function askQuestion(question, validationFunction, callback) {
    rl.question(question, (answer) => {
        if (!validationFunction(answer)) {
            console.log(`Entrée invalide. Veuillez fournir une entrée valide.`);
            askQuestion(question, validationFunction, callback);
        } else {
            callback(answer);
        }
    });
}

/*
Description : Fonction de création d'interface pour demander des informations
Entrée : Aucune
Fonctionnement : lis les informations entrées par l'utilisateur
Sortie : Aucune
*/

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
Description : Appel de la fonction askQuestion récursivement 
Entrée : Aucune
Fonctionnement : Appel recursif de la fonction avec de nouvelles informations a chaque appel, puis appel de la fonction de création de VCard 
Sortie : Aucune
*/

function askQuestions() {
    askQuestion('Prénom : ', (answer) => true, (firstName) => {
        askQuestion('Nom : ', (answer) => true, (lastName) => {
            askQuestion('Email : ', isValidEmail, (email) => {
                askQuestion('Numéro de téléphone : ', isValidPhoneNumber, (phoneNumber) => {
                    askQuestion('Rôle : ', (answer) => true, (role) => {
                        askQuestion('Département : ', (answer) => true, (department) => {
                            askQuestion('Chemin du dossier de sortie (laissez vide pour le dossier courant) : ', (answer) => true, (outputDirectory) => {
                                if (!outputDirectory) {
                                    outputDirectory = process.cwd();
                                }
                                createTeacherVCard(firstName, lastName, email, phoneNumber, role, department, outputDirectory);
                                rl.close();
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    askQuestions,
};
