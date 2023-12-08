class TestQuestionnaire {
    constructor(parsedQuestions = []) {
        this.questions = parsedQuestions
    }

    async start() {
        const test = await inquirer.prompt();
        
        console.log(test)
    }

}