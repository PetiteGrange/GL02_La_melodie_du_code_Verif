const QuestionType = {
    VF: 'QUESTION_VRAI_FAUX',
    // ::Q1:: 1+1=2 {T}
    QCU: 'QUESTION_CHOIX_UNIQUE',
    // ::Q2:: What's between orange and green in the spectrum? 
    // { =yellow # right; good! ~red # wrong, it's yellow ~blue # wrong, it's yellow }
    QCM: 'QUESTION_CHOIX_MULTIPLE',
    // ::Q3:: What's between 1 and 5? 
    // { =%50%2 =%50%3 ~%-100%7 }
    ASSO: 'QUESTION_ASSOCIATION',
    // ::Q4:: Which animal eats which food? { =cat -> cat food =dog -> dog food }
    NUM_E: 'QUESTION_NUMERIQUE_ECART',
    // ::Q5:: What is a number from 1 to 5? {#3:2}
    NUM_R: 'QUESTION_NUMERIQUE_RANGE',
    // ::Q6:: What is a number from 1 to 5? {#1..5}
    TEXT: 'QUESTION_TEXT',
    // ::Q7:: How are you? {}
    SA: 'SHORT_ANSWER',
    // ::Q8:: Two plus two equals {=four =4}
    MW: 'MISSING WORD',
    // ::Q8:: Would you like {~=some~a few} rice with your chicken?
    EXAMPLE: 'EXAMPLE'
}

module.exports = QuestionType;
