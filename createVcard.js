const fs = require('fs');
const path = require('path');

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

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }

    fs.writeFileSync(outputPath, vCardContent);
    console.log(`Fichier vCard créé avec succès : ${outputPath}`);
}

function askQuestion(question, callback) {
    rl.question(question, (answer) => {
        callback(answer);
    });
}

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestions() {
    askQuestion('Prénom : ', (firstName) => {
        askQuestion('Nom : ', (lastName) => {
            askQuestion('Email : ', (email) => {
                askQuestion('Numéro de téléphone : ', (phoneNumber) => {
                    askQuestion('Rôle : ', (role) => {
                        askQuestion('Département : ', (department) => {
                            askQuestion('Chemin du dossier de sortie (laissez vide pour le dossier courant) : ', (outputDirectory) => {
                                if (!outputDirectory) {
                                    outputDirectory = process.cwd(); // Dossier courant
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

askQuestions();
