
var expect = require('chai').expect;
var Graph = require('./graph.js');

describe("Testing that Graph object works", function(){

	it("Has neighbors, and equals members", function(){
		var neighborFn = function(vert){return [ {neighbor: vert, cost:1}  ]; };
		var g = new Graph(neighborFn);
		expect(typeof g.neighbors).to.equal('function')
		expect(typeof g.equals).to.equal('function')
		expect(typeof g.vertToStr).to.equal('function')
	});

});