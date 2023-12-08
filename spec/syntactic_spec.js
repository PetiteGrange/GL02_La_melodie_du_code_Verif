describe("Program Syntactic testing of GiftParser", function(){

	beforeAll(function() {
		const Q = require('../Question');
		const Parser = require('../GiftParser');
		this.analyzer = new Parser();
	});

	it("peut transformer un texte format GIFT en objet.s Question", function(){
		let input = "::EM U4 p33 Review 4.5 boring::[html]I get bored by people who talk too much.<br>\n<b>FIND</b><br>\nI {=find it boring#change of adjective form: bored – boring} when people talk too much.\n\n::EM U4 p33 Review 4.6 for the first time::[html]I had never seen a glacier before I went to Norway<br>\n<b>I</b><br>\nWhen I was in Norway, {=I saw a glacier for#I had never seen – I saw ... for the first time} the first time.";
		this.analyser.parse(input);
		expect(this.analyzer.parsedQuestions).toEqual([
			{
				title: 'EM U4 p33 Review 4.5 boring',
				text: '[html]I had never seen a glacier before I went to Norway<br><b>I</b><br>When I was in Norway, ->1<- the first time.',
				type: [ 'QUESTION_TEXT_A_TROUS' ],
				answer: [ [ [Object] ] ],
				partialCredit: false
			},
			{
				title: 'EM U4 p33 Review 4.6 for the first time',
				text: 'I get bored by people who talk too much.<br><b>FIND</b><br>I ->1<- when people talk too much.',
				type: [ 'QUESTION_TEXT_A_TROUS' ],
				answer: [ [ [Object] ] ],
				partialCredit: false
			}
		]);
	});
});
