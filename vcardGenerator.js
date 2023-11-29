const fs = require('fs');
const path = require('path');
const readline = require('readline');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    return !isNaN(phoneNumber);
}

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
