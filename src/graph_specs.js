
var expect = require('chai').expect;
var Graph = require('./graph.js');

describe("Testing that Graph object works", function(){

	it("Has allVertice, neighbors, and equals members", function(){
		var vertices = [1];
		var neighborFn = function(vert){return [ {neighbor: vert, cost:1}  ]; };
		var g = new Graph(vertices, neighborFn);
		expect(typeof g.allVertices).to.equal('function');
		expect(typeof g.neighbors).to.equal('function')
		expect(typeof g.neighbors).to.equal('function')
	});

	it("Passes a slightly more complex set-up", function(){
		var vertices = [1,2,3,4,5,6,7];
		var neighborFn = function(vert){return [ {neighbor: vert+1, cost:1}, {neighbor: vert-1, cost:1}  ]; };
		var g = new Graph(vertices, neighborFn);
	});

	it('Passes a yet more complex 2d set-up', function(){
		var vertices = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];
		var neighborFn = function(vert){
			var neighbors = [];
			(vert[0] > 1) && neighbors.push({neighbor: [vert[0]-1, vert[1]], cost: 1});
			(vert[0] < 3) && neighbors.push({neighbor: [vert[0]+1, vert[1]], cost: 1});
			(vert[1] > 1) && neighbors.push({neighbor: [vert[0], vert[1]-1], cost: 1});
			(vert[1] < 3) && neighbors.push({neighbor: [vert[0], vert[1]+1], cost: 1});
			return neighbors;
		}
		var g = new Graph(vertices, neighborFn);
	})

	it('Throws an error if the successor function doesnt return a cost', function(){
		var vertices = [1,2,3,4,5,6,7];
		var neighborFn = function(vert){return [ {neighbor: vert+1}, {neighbor: vert-1} ]; };
		var willThrow = () => new Graph(vertices, neighborFn);
		expect(willThrow).to.throw();
	});

	it('Throws an error if the identity function doesnt return true for identical things', function(){
		var vertices = [1,2,3,4,5,6,7];
		var neighborFn = function(vert){return [ {neighbor: vert+1, cost:1}, {neighbor: vert-1, cost:1}  ]; };
		var identityFn = function(a,b){return a == b + 1;};
		var willThrow = () => new Graph(vertices, neighborFn, identityFn);
		var willThrow = () => new Graph(vertices, neighborFn, identityFn);
		expect(willThrow).to.throw();
	});

});