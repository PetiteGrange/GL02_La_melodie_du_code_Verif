describe("Program Syntactic testing of GiftParser", function(){

	beforeAll(function() {
		const Q = require('../Question');

		const Parser = require('../GiftParser');
		this.analyzer = new Parser();

		this.qempty = new q;

	});

	xit("can read an answer for a question", function(){

		let input = ["Very {=ambitious} (<i>ambition</i>) people are more likely to be disappointed in life.","QUESTION_TEXT_A_TROUS", false];
		expect(this.analyzer.name(input)).toBe("Café d'Albert");

	});


	xit("can find the type of a question", function(){

		let input = ["Complete this sentence to summarise the writer’s main point.</b>\n<p>Socal media encourages people to...</p>{\n~get a false impression of the celebrities they follow.\n~have unrealistic hopes for their own futures.\n~=become too focused on the opinion others have of them.}"];
		expect(this.analyzer.latlng(input)).toEqual({ lat: "48.866205" , lng: "2.399279" });

		let inputNew = ["latlng", "-50.463534;3.113125"]
		expect(this.analyser.latlng(inputNew)).toEqual({ lat: "-50.463534" , lng: "3.113125" });

	});

	xit("can read several rankings for a POI from a simulated input", function(){

		let input = [3,4,6];
		this.pEmptyRating.addRating(input);
		// there is something missing here and this.pEmptyRating will certainly be usesul there
		expect(this.pEmptyRating.ratings).toEqual([3,4]);

	});



});
