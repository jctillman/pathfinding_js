
var expect = require('chai').expect;
var Graph = require('./graph.js');

describe("Testing that Graph object works", function(){

	it("Has neighbors, and equals members", function(){
		var vertices = [1];
		var neighborFn = function(vert){return [ {neighbor: vert, cost:1}  ]; };
		var g = new Graph(neighborFn);
		expect(typeof g.neighbors).to.equal('function')
		expect(typeof g.neighbors).to.equal('function')
	});

	it("Passes a slightly more complex set-up", function(){
		var neighborFn = function(vert){return [ {neighbor: vert+1, cost:1}, {neighbor: vert-1, cost:1}  ]; };
		var g = new Graph(neighborFn);
	});

	it('Passes a yet more complex 2d set-up', function(){
		var neighborFn = function(vert){
			var neighbors = [];
			(vert[0] > 1) && neighbors.push({neighbor: [vert[0]-1, vert[1]], cost: 1});
			(vert[0] < 3) && neighbors.push({neighbor: [vert[0]+1, vert[1]], cost: 1});
			(vert[1] > 1) && neighbors.push({neighbor: [vert[0], vert[1]-1], cost: 1});
			(vert[1] < 3) && neighbors.push({neighbor: [vert[0], vert[1]+1], cost: 1});
			return neighbors;
		}
		var g = new Graph(neighborFn);
	})

});