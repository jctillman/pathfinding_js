
var expect = require('chai').expect;
var Graph = require('./graph.js');

describe("Testing that Graph object works", function(){

	it("Has allVertice, successors, and equals members", function(){
		var vertices = [1];
		var successorFn = function(){return [ [1,1] ] };
		var g = new Graph(vertices, successorFn, identityFn);
		expect(typeof g.allVertices).to.equal('function');
		expect(typeof g.successors).to.equal('function')
		expect(typeof g.successors).to.equal('function')
	});

	it("Passes a slightly more complex set-up", function(){
		var vertices = [1,2,3,4,5,6,7];
		var successorFn = function(vert){return [ [1,vert+1], [1, vert-1] ]; };
		var g = new Graph(vertices, successorFn);
	});

	it('Passes a yet more complex 2d set-up', function(){
		var vertices = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];
		var successorFn = function(vert){
			var successors = [];
			(vert[0] > 1) && successors.push([[vert[0]-1, vert[1]], 1]);
			(vert[0] < 3) && successors.push([[vert[0]+1, vert[1]], 1]);
			(vert[1] > 1) && successors.push([[vert[0], vert[1]-1], 1]);
			(vert[1] < 3) && successors.push([[vert[0], vert[1]+1], 1]);
			return successors;
		}
		var g = new Graph(vertices, successorFn);
	})

	it('Throws an error if the successor function doesnt return a cost', function(){
		var vertices = [1,2,3,4,5,6,7];
		var successorFn = function(vert){return [ [vert+1], [vert-1] ]; };
		var identityFn = function(a,b){return a.toString() == b.toString();};
		var willThrow = () => new Graph(vertices, successorFn, identityFn);
		expect(willThrow).to.throw();
	});

	it('Throws an error if the identity function doesnt return true for identical things', function(){
		var vertices = [1,2,3,4,5,6,7];
		var successorFn = function(vert){return [ [vert+1,1], [vert-1,1] ]; };
		var identityFn = function(a,b){return a == b + 1;};
		var willThrow = () => new Graph(vertices, successorFn, identityFn);
		var willThrow = () => new Graph(vertices, successorFn, identityFn);
		expect(willThrow).to.throw();
	});

});