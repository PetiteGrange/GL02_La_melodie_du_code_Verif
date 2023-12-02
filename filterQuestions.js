function filterQuestions(parsedQuestions, selectedTypes) {
    parsedQuestions.forEach(question => {
        console.log(question.type);
    });

    const filteredQuestions = parsedQuestions.filter(question => {
        return selectedTypes.includes(question.type);
    });

    console.log(selectedTypes);
    console.log(filteredQuestions,'\n');

    return filteredQuestions;
}

module.exports = filterQuestions;