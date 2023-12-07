const Q = require('../Question');

describe("Program Semantic testing of Question", function(){

	beforeAll(function() {

		this.q = new Q('EM U4 p33 Review 4.6 for the first time','[html]I had never seen a glacier before I went to Norway <br><b>I</b><br> When I xas in Norway, ->1<- the first time.',[ 'QUESTION_TEXT_A_TROUS' ],[ 'réponse' ], false);

	});

	it("peut créer un nouvel objet question à partir de données GIFT", function(){

		expect(this.q).toBeDefined();
		// toBe is === on simple values
		expect(this.q.title).toBe('EM U4 p33 Review 4.6 for the first time');
		expect(this.q).toEqual(jasmine.objectContaining({title: 'EM U4 p33 Review 4.6 for the first time'}));

		expect(this.q.text).toBe('[html]I had never seen a glacier before I went to Norway <br><b>I</b><br> When I xas in Norway, ->1<- the first time.');
		expect(this.q).toEqual(jasmine.objectContaining({text: '[html]I had never seen a glacier before I went to Norway <br><b>I</b><br> When I xas in Norway, ->1<- the first time.'}));

		expect(this.q.type).toEqual([ 'QUESTION_TEXT_A_TROUS' ]);
		expect(this.q).toEqual(jasmine.objectContaining({type: [ 'QUESTION_TEXT_A_TROUS' ]}));

		expect(this.q.answer).toEqual([ 'réponse' ]);
		expect(this.q).toEqual(jasmine.objectContaining({answer: [ 'réponse' ]}));

		expect(this.q.partialCredit).toBe(false);
		expect(this.q).toEqual(jasmine.objectContaining({partialCredit: false}));

	});
});
