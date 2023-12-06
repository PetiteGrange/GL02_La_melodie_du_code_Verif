const Q = require('../Question');

describe("Program Semantic testing of Question", function(){

	beforeAll(function() {

		this.q = new Q;

	});

	xit("can create a new POI", function(){

		expect(this.p).toBeDefined();
		// toBe is === on simple values
		expect(this.p.name).toBe("Café d'Albert");
		expect(this.p).toEqual(jasmine.objectContaining({name: "Café d'Albert"}));

	});

	xit("can add a new ranking", function(){

		this.p.addRating(2);
		// toEqual is === on complex values - deepEquality
		expect(this.p.ratings).toEqual([1,3,2,2]);

	});

	xit("can compute average ratings", function(){

		expect(this.p.averageRatings()).toBe(2);
	});


});
