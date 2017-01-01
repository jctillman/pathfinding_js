
var expect = require('chai').expect;
var Graph = require('./graph.js');

var pathFinders = require('./pathfinders.js');
var dijkstra = pathFinders.dijkstra;
var astar = pathFinders.astar;


var maxCost = 100000;

var lineVertices = [1,2,3,4,5,6,7];
var lineNeighborFn = function(vert){
	return [ {neighbor: vert+1, cost:1}, {neighbor: vert-1, cost:1}  ]; };
var lineGraph = new Graph(lineVertices, lineNeighborFn);

var planeVertices = [[1,1],[1,2],[2,1],[2,2]];
var planeNeighborFn = function(vert){
	var neighbors = [];
	(vert[0] > 1) && neighbors.push({neighbor: [vert[0]-1, vert[1]], cost: 1});
	(vert[0] < 3) && neighbors.push({neighbor: [vert[0]+1, vert[1]], cost: 1});
	(vert[1] > 1) && neighbors.push({neighbor: [vert[0], vert[1]-1], cost: 1});
	(vert[1] < 3) && neighbors.push({neighbor: [vert[0], vert[1]+1], cost: 1});
	return neighbors;}
var planeGraph = new Graph(planeVertices, planeNeighborFn);


describe("Dijkstra finds paths", function(){

	//You can skip all these, and write the dijkstra function directly
	//However, if you write all of these functions, dijkstra will itself
	//only require about six lines.
	describe('Unit Testing: That sub-sections used for finding paths work', function(){

		describe('dInit: Creates the closedSet, openSet, fromStart, gScore variables', function(){

			var fn = pathFinders.dijsktraHelper.dInit;

			it ('returns closedSet, openSet, fromStart, gScore in an object', function(){
				var startVertice = 1
				var {closedSet, openSet, fromStart, gScore} = fn(lineGraph, startVertice);
				expect(closedSet != undefined).to.equal(true)
				expect(openSet != undefined).to.equal(true)
				expect(fromStart != undefined).to.equal(true)
				expect(gScore != undefined).to.equal(true)
			});

			it('returns closedSet and fromStart empty', function(){
				var startVertice = 1
				var {closedSet, openSet, fromStart, gScore} = fn(lineGraph, startVertice);
				expect(Object.keys(closedSet).length).to.equal(0)
				expect(Object.keys(fromStart).length).to.equal(0)
			});

			it('returns openSet and gScore with one element', function(){
				var startVertice = 1
				var {closedSet, openSet, fromStart, gScore} = fn(lineGraph, startVertice);
				expect(Object.keys(openSet).length).to.equal(1)
				expect(Object.keys(gScore).length).to.equal(1)
				//The open set has the starting vertice only, to start with
				expect(openSet['1'] == startVertice)
				//While gScore is set for zero for that vertice, because there 
				//is no cost to getting to it.
				expect(gScore['1'] == 0)
			});
			
		});

		describe('closestVert: returns info about the closest vertice to the start in allVertices', function(){

			it('"vertice" should be the kind of thing in the graphs list of vertices', function(){

				//So, for a the lineGraph graph, vertice should be 
				//a number
				var startVertice = 1;
				var init = pathFinders.dijsktraHelper.dInit;
				var {closedSet, openSet, fromStart, gScore} = init(lineGraph, startVertice);

				var fn = pathFinders.dijsktraHelper.closestVert;
				var vertice = fn(lineGraph, openSet, gScore)
				expect(typeof vertice).to.equal('number');

				//while, for the planeGraph graph, vertice should 
				//be an array with two elements.
				var startVertice = [1,1];
				var init = pathFinders.dijsktraHelper.dInit;
				var {closedSet, openSet, fromStart, gScore} = init(planeGraph, startVertice);

				var fn = pathFinders.dijsktraHelper.closestVert;
				var vertice = fn(lineGraph, openSet, gScore);
				expect(Array.isArray(vertice)).to.equal(true);
				expect(vertice.length).to.equal(2);
				

			});

			it('returns the closest vertices, given a particular map of costs', function(){


				var startVertice = 1;
				var init = pathFinders.dijsktraHelper.dInit;
				var {closedSet, openSet, fromStart, gScore} = init(lineGraph, startVertice);
				gScore[3] = 3;
				gScore[4] = 3;
				var fn = pathFinders.dijsktraHelper.closestVert;

				var vertice = fn(lineGraph, openSet, gScore)
				expect(vertice).to.equal(1);
			
			})

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

			var [path,_] = dijkstra(lineGraph, 1, 7);
			expect(path).to.deep.equal([1,2,3,4,5,6,7])

		});

		it('It can return the path for a simple 2d route', function(){

			var [pathOne,_] = dijkstra(planeGraph, [1,1], [1,3]);
			var [pathTwo,_] = dijkstra(planeGraph, [3,1], [1,1]);
			expect(pathOne).to.deep.equal([[1,1],[1,2],[1,3]])
			expect(pathTwo).to.deep.equal([[3,1],[2,1],[1,1]])

		});

	});

});

describe('astar finds paths', function(){

	describe('Unit Testing: Sub-sections used in finding paths work', function(){

		describe('estimatorMaker: Helps get manhattan distance between a start and ending', function(){
			var fn = pathFinders.astarHelper.estimatorMaker;
			it('returns a function', function(){
				expect(typeof fn([1,1])).to.equal('function');
			});
		});

		describe('aInit: Returns all the variables desired', function(){

			var fn = pathFinders.astarHelper.aInit;

			it ('returns closedSet, openSet, fromStart, gScore, fScore in an object', function(){
				var startVertice = [1,1]
				var estimator = pathFinders.astarHelper.estimatorMaker([2,2])
				var {closedSet, openSet, fromStart, gScore, fScore} = fn(planeGraph, startVertice, estimator);
				expect(closedSet != undefined).to.equal(true)
				expect(openSet != undefined).to.equal(true)
				expect(fromStart != undefined).to.equal(true)
				expect(gScore != undefined).to.equal(true)
				expect(fScore != undefined).to.equal(true)
			});

			it('returns closedSet and fromStart empty', function(){

				var startVertice = [1,1]
				var estimator = pathFinders.astarHelper.estimatorMaker([2,2])
				var {closedSet, openSet, fromStart, gScore, fScore} = fn(planeGraph, startVertice, estimator);
				expect(Object.keys(closedSet).length).to.equal(0)
				expect(Object.keys(fromStart).length).to.equal(0)
			});

			it('returns openSet and gScore with one element', function(){
				var startVertice = [1,1]
				var estimator = pathFinders.astarHelper.estimatorMaker([2,2])
				var {closedSet, openSet, fromStart, gScore, fScore} = fn(planeGraph, startVertice, estimator);
				
				expect(Object.keys(openSet).length).to.equal(1)
				expect(Object.keys(gScore).length).to.equal(1)
				//The open set has the starting vertice only, to start with
				expect(openSet['1,1'] == startVertice).to.equal(true)
				//While gScore is set for zero for that vertice, because there 
				//is no cost to getting to it.
				expect(gScore['1,1'] == 0).to.equal(true)
				//fScore should be set to the initial estimated
				//distance between the start and the end
				expect(fScore['1,1'] == estimator([1,1])).to.equal(true)
			});
			
		});

	});

	describe('Integration testing: That it can find paths', function(){

		it("It can return the path for a simple 1d route", function(){

			var lineVertices = [1,2,3,4,5,6,7];
			var lineNeighborFn = function(vert){
				return [ {neighbor: vert+1, cost:1}, {neighbor: vert-1, cost:1}  ]; 
			};
			var lineGraph = new Graph(lineVertices, lineNeighborFn);

			var [path,_] = astar(lineGraph, 1, 7);
			expect(path).to.deep.equal([1,2,3,4,5,6,7])

		});

		it('It can return the path for a simple 2d route', function(){

			var planeVertices = [[1,1],[1,2],[2,1],[2,2]];
			var planeNeighborFn = function(vert){
				var neighbors = [];
				(vert[0] > 1) && neighbors.push({neighbor: [vert[0]-1, vert[1]], cost: 1});
				(vert[0] < 3) && neighbors.push({neighbor: [vert[0]+1, vert[1]], cost: 1});
				(vert[1] > 1) && neighbors.push({neighbor: [vert[0], vert[1]-1], cost: 1});
				(vert[1] < 3) && neighbors.push({neighbor: [vert[0], vert[1]+1], cost: 1});
				return neighbors;
			}
			var planeGraph = new Graph(planeVertices, planeNeighborFn);
			var [pathOne,_] = astar(planeGraph, [1,1], [1,3]);
			var [pathTwo,_] = astar(planeGraph, [3,1], [1,1]);
			expect(pathOne).to.deep.equal([[1,1],[1,2],[1,3]])
			expect(pathTwo).to.deep.equal([[3,1],[2,1],[1,1]])

		});

	});

});


