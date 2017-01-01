
var expect = require('chai').expect;
var Graph = require('./graph.js');

var pathFinders = require('./pathfinders.js');
var dijkstra = pathFinders.dijkstra;
var astar = pathFinders.dijkstra;



describe("Dijkstra finds paths", function(){

	//You can skip all these, and write the dijkstra function directly
	//However, if you write all of these functions, dijkstra will itself
	//only require about six lines.
	describe('Unit Testing: That sub-sections used for finding paths work', function(){

		var maxCost = 123;

		var lineVertices = [1,2,3,4,5,6,7];
		var lineSuccessorFn = function(vert){
			return [ [vert, 0], [vert+1, 1], [vert-1, 1] ];
		};
		var lineGraph = new Graph(lineVertices, lineSuccessorFn);

		var planeVertices = [[1,1],[1,2],[2,1],[2,2]];
		var planeSuccessorFn = function(vert){
			var successors = []
			if (vert[0] > 1) { successors.push([vert[0]-1,vert[1],1]) }
			if (vert[0] < 2) { successors.push([vert[0]+1,vert[1],1]) }
			if (vert[1] > 1) { successors.push([vert[0],vert[1]-1,1]) }
			if (vert[1] < 2) { successors.push([vert[0],vert[1]+1,1]) }
			return successors;
		};
		var planeGraph = new Graph(planeVertices, planeSuccessorFn);


		describe('initVars: Creates the costFromStart, closestToStart, and allVertices variables', function(){

			var fn = pathFinders.dijsktraHelper.initVars;

			it ('returns costFromStart, closestToStart, and allVertices in an object', function(){
				var maxCost = 123;
				var startVertice = 1
				var {costFromStart, closestToStart, allVertices} = fn(lineGraph, startVertice, maxCost);
				expect(costFromStart != undefined).to.equal(true)
				expect(closestToStart != undefined).to.equal(true)
				expect(allVertices != undefined).to.equal(true)
			});

			it('returns costFromStart filled with maxCost, except for at the start, which is zero', function(){
				var maxCost = 123;
				var startVertice = 1
				var {costFromStart, closestToStart, allVertices} = fn(lineGraph, startVertice, maxCost);
				expect(costFromStart[1]).to.equal(0);
				expect(costFromStart[2]).to.equal(maxCost);
				expect(costFromStart[7]).to.equal(maxCost);
			});

			it('returns closestToStart filled with nulls', function(){
				var maxCost = 123;
				var startVertice = 1
				var {costFromStart, closestToStart, allVertices} = fn(lineGraph, startVertice, maxCost);
				expect(closestToStart[1]).to.equal(null);
				expect(closestToStart[2]).to.equal(null);
				expect(closestToStart[6]).to.equal(null);
				expect(closestToStart[7]).to.equal(null);
			});

			it('returns allVertices an an array with all the vertices', function(){
				var maxCost = 123;
				var startVertice = 1
				var {costFromStart, closestToStart, allVertices} = fn(lineGraph, startVertice, maxCost);
				expect(allVertices).to.deep.equal([1,2,3,4,5,6,7])
			});
			
		});

		describe('closestVert: returns info about the closest vertice to the start in allVertices', function(){

			it('returns an object that has vertice and verticeDist as properties', function(){

				var startVertice = 1;
				var init = pathFinders.dijsktraHelper.initVars;
				var {costFromStart, closestToStart, allVertices} = init(lineGraph, startVertice, maxCost);
				costFromStart[2] = 2;
				costFromStart[3] = 3;
				costFromStart[4] = 4;

				var fn = pathFinders.dijsktraHelper.closestVert;

				var least = fn(lineGraph, allVertices, costFromStart)
				expect(least.vertice !== undefined).to.equal(true);
				expect(least.verticeDist !== undefined).to.equal(true)

			});

			it('"vertice" property should be the kind of thing in the graphs list of vertices', function(){

				//So, for a the lineGraph graph, vertice should be 
				//a number
				var startVertice = 1;
				var init = pathFinders.dijsktraHelper.initVars;
				var {costFromStart, closestToStart, allVertices} = init(lineGraph, startVertice, maxCost);
				costFromStart[2] = 2;
				var fn = pathFinders.dijsktraHelper.closestVert;
				var least = fn(lineGraph, allVertices, costFromStart)
				expect(typeof least.vertice).to.equal('number');

				//while, for the planeGraph graph, vertice should 
				//be an array with two elements.
				var startVertice = [1,1];
				var init = pathFinders.dijsktraHelper.initVars;
				var {costFromStart, closestToStart, allVertices} = init(planeGraph, startVertice, maxCost);
				costFromStart[planeGraph.vertToStr(startVertice)] = 2;
				var fn = pathFinders.dijsktraHelper.closestVert;
				var least = fn(lineGraph, allVertices, costFromStart);
				expect(Array.isArray(least.vertice)).to.equal(true);
				expect(least.vertice.length).to.equal(2);
				

			});

			it('successively returns the closest vertices, given a particular map of costs', function(){

				var startVertice = 1;
				var init = pathFinders.dijsktraHelper.initVars;
				var {costFromStart, closestToStart, allVertices} = init(lineGraph, startVertice, maxCost);
				costFromStart[2] = 2;
				costFromStart[3] = 3;
				costFromStart[4] = 3;
				var fn = pathFinders.dijsktraHelper.closestVert;

				var least = fn(lineGraph, allVertices, costFromStart)
				expect(least.vertice).to.equal(1);
				expect(least.verticeDist).to.equal(0);
				expect(allVertices.length).to.equal(6);

				var least = fn(lineGraph, allVertices, costFromStart)
				expect(least.vertice).to.equal(2);
				expect(least.verticeDist).to.equal(2);
				expect(allVertices.length).to.equal(5);

				var least = fn(lineGraph, allVertices, costFromStart)
				expect(least.vertice).to.equal(3);
				expect(least.verticeDist).to.equal(3);
				expect(allVertices.length).to.equal(4);

			})

		});

		describe('alterMaps: changes the map from vertice id to cost and to closest to start', function(){

			it('does not actually return anything', function(){

				var alterMaps = pathFinders.dijsktraHelper.alterMaps;
				var vertice = 1
				var verticeDist = 0
				var closestToStart = {
					1: null,
					2: null,
					3: null,
					4: null,
					5: null,
					6: null,
					7: null
				}
				var costFromStart = {
					1: 0,
					2: maxCost,
					3: maxCost,
					4: maxCost,
					5: maxCost,
					6: maxCost,
					7: maxCost
				}

				var n = alterMaps(lineGraph, vertice, verticeDist, closestToStart, costFromStart);
				expect(n).to.equal(undefined);

			});

			it('alters the maps appropriately', function(){

				var alterMaps = pathFinders.dijsktraHelper.alterMaps;
				var vertice = 1
				var verticeDist = 0
				var closestToStart = {
					1: null,
					2: null,
					3: null,
					4: null,
					5: null,
					6: null,
					7: null
				}
				var costFromStart = {
					1: 0,
					2: maxCost,
					3: maxCost,
					4: maxCost,
					5: maxCost,
					6: maxCost,
					7: maxCost
				}

				var n = alterMaps(lineGraph, vertice, verticeDist, closestToStart, costFromStart);

				expect(closestToStart[2]).to.equal(1)
				expect(costFromStart[2]).to.equal(1)

			});

		});

		describe('getPath: creates a path from the closestToStart map', function(){

			it('does what it says on the box', function(){

				var getPath = pathFinders.dijsktraHelper.getPath;
				var endingVertice = 7
				var closestToStart = {
					1: null,
					2: 1,
					3: 2,
					4: 3,
					5: 4,
					6: 5,
					7: 6
				};
				var path = getPath(lineGraph, closestToStart, endingVertice);
				expect(path).to.deep.equal([1,2,3,4,5,6,7])

			});

		})


	});

	describe('Integration testing: That it can find paths', function(){

		it("It can return the path for a simple 1d route", function(){

			var vertices = [1,2,3,4,5,6,7];
			var successorFn = function(vert){return [ [vert,0], [vert+1,1], [vert-1,1] ]; };
			var lineGraph = new Graph(vertices, successorFn);

			var [path,_] = dijkstra(lineGraph, 1, 7);
			expect(path).to.deep.equal([1,2,3,4,5,6,7])

		});

		it('It can return the path for a simple 2d route', function(){

			var vertices = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];
			var successorFn = function(vert){
				var successors = [];
				if (vert[0] > 1) { successors.push([[vert[0]-1, vert[1]], 1]); }
				if (vert[0] < 3) { successors.push([[vert[0]+1, vert[1]], 1]); }
				if (vert[1] > 1) { successors.push([[vert[0], vert[1]-1], 1]); }
				if (vert[1] < 3) { successors.push([[vert[0], vert[1]+1], 1]); }
				return successors;
			}
			var twoDGraph = new Graph(vertices, successorFn);
			var [pathOne,_] = dijkstra(twoDGraph, [1,1], [1,3]);
			var [pathTwo,_] = dijkstra(twoDGraph, [3,1], [1,1]);
			expect(pathOne).to.deep.equal([[1,1],[1,2],[1,3]])
			expect(pathTwo).to.deep.equal([[3,1],[2,1],[1,1]])

		});

	});

});

describe('astar finds paths', function(){


});


