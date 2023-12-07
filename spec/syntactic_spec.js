describe("Program Syntactic testing of GiftParser", function(){

	beforeAll(function() {
		const Q = require('../Question');
		const Parser = require('../GiftParser');
		this.analyzer = new Parser();
	});

	it("peut tokenizer le texte d'un fichier", function(){
		let input = "::EM U4 p33 Review 4.5 boring::[html]I get bored by people who talk too much.<br>\n<b>FIND</b><br>\nI {=find it boring#change of adjective form: bored – boring} when people talk too much.\n\n::EM U4 p33 Review 4.6 for the first time::[html]I had never seen a glacier before I went to Norway<br>\n<b>I</b><br>\nWhen I was in Norway, {=I saw a glacier for#I had never seen – I saw ... for the first time} the first time.";
		expect(this.analyzer.tokenize(input)).toEqual(["::EM U4 p33 Review 4.5 boring::[html]I get bored by people who talk too much.<br>\n<b>FIND</b><br>\nI {=find it boring#change of adjective form: bored – boring} when people talk too much.","::EM U4 p33 Review 4.6 for the first time::[html]I had never seen a glacier before I went to Norway<br>\n<b>I</b><br>\nWhen I was in Norway, {=I saw a glacier for#I had never seen – I saw ... for the first time} the first time."]);
	});


	xit("can find the type of a question", function(){
		let input =
		expect(this.analyser.type(input)).toEqual('');
	});

	xit("can read several rankings for a POI from a simulated input", function(){
		let input = [3,4,6];
		this.pEmptyRating.addRating(input);
		// there is something missing here and this.pEmptyRating will certainly be usesul there
		expect(this.pEmptyRating.ratings).toEqual([3,4]);
	});
});
