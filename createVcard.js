const fs = require('fs');

function createTeacherVCard(firstName, lastName, email, phoneNumber, role, department) {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${firstName} ${lastName}
N:${lastName};${firstName};;;
EMAIL:${email}
TEL:${phoneNumber}
ROLE:${role}
DEPARTMENT:${department}
END:VCARD`;

    fs.writeFileSync('teacher_contact.vcf', vCardContent);
    console.log('Fichier vCard créé avec succès : teacher_contact.vcf');
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
                            createTeacherVCard(firstName, lastName, email, phoneNumber, role, department);
                            rl.close();
                        });
                    });
                });
            });
        });
    });
}

askQuestions();
