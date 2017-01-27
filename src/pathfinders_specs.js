//TEST SPEC FOR "PATHFINDERS.jS"
//
// "pathfinders.js" is the only file that needs
// to be modified for the tutorial.
//
// You may wish to look at graph.js,
// to understand what that does.
// But if you look anywhere else that
// will probably be a waste of time.
var expect = require('chai').expect;
var Graph = require('./graph.js');

//Pulling functions from pathfinders.
var pathFinders = require('./pathfinders.js');
var dijkstra = pathFinders.dijkstra;
var astar = pathFinders.astar;

/* Both dijkstra and astar find the lowest-cost paths
   across graphs.  Thus, it makes sense to write them to interact with
   a small graph class.  The following creates two instances of a
   graph class: one represents a 1d line, the other represents a 2d plane.
*/
//LINE GRAPH -- Represents a 1d line, that one can travel up and down.
//
var lineNeighborFn = function(vert){
	return [
		{neighbor: vert+1, cost:1},
		{neighbor: vert-1, cost:1}
		];
	};
var lineGraph = new Graph(lineNeighborFn);

var planeNeighborFn = function(vert){
	var neighbors = [];
	(vert[0] > 1) && neighbors.push({neighbor: [vert[0]-1, vert[1]], cost: 1});
	(vert[0] < 3) && neighbors.push({neighbor: [vert[0]+1, vert[1]], cost: 1});
	(vert[1] > 1) && neighbors.push({neighbor: [vert[0], vert[1]-1], cost: 1});
	(vert[1] < 3) && neighbors.push({neighbor: [vert[0], vert[1]+1], cost: 1});
	return neighbors;}
var planeGraph = new Graph(planeNeighborFn);


describe("Dijkstra finds paths", function(){

	// You can skip all these, and write the dijkstra function directly
	// However, if you write all of these functions, dijkstra will
	// require fewer lines
	describe('Unit Testing: That sub-sections used for finding paths work', function(){

		it('dInit: Creates the closedSet, openSet, from, cost and variables', function(){

			var fn = pathFinders.dijsktraHelper.dInit;
			var startVertice = 1
			var {closedSet, openSet, from, cost} = fn(startVertice);

			//Check that closedSet, openSet, from, and cost exist.
			expect(closedSet != undefined).to.equal(true)
			expect(openSet != undefined).to.equal(true)
			expect(from != undefined).to.equal(true)
			expect(cost != undefined).to.equal(true)

			//closedSet and from should simply be empty
			expect(Object.keys(closedSet).length).to.equal(0)
			expect(Object.keys(from).length).to.equal(0)

			//openSet and cost should not be empty.
			//The open set has the starting vertice only, to start with
			expect(openSet['1'] == startVertice).to.equal(true)
			//While cost is set for zero for that vertice,
			//because there is no cost to getting to it.
			expect(cost['1'] == 0).to.equal(true)
			
		});

		it('closestVert: returns the cheapest vertex from a set of open vertexes', function(){

			var fn = pathFinders.dijsktraHelper.closestVert;
			//Create an openSet with two points.
			var openSet = {
				'1,2': [1,2],
				'2,2': [2,2]
			}
			//And a cost map with four pints.
			var cost = {
				'1,1' : 0,
				'1,2' : 1,
				'2,1' : 1,
				'2,2' : 2
			}
			
			// "vertex" should be [1,2], because that
			// is the member of openSet with the least
			// cost.
			var vertex = fn(openSet, cost);
			expect(Array.isArray(vertex)).to.equal(true);
			expect(vertex.length).to.equal(2);
			expect(vertex[0]).to.equal(1);
			expect(vertex[1]).to.equal(2);
		});

		it('getPath: creates a path from the "from" map', function(){

			// Given a graph in which the nodes are
			// the integers (1,2,3, etc), and each
			// integer is connected to the immediately
			// higher / lower integers (so 5 has 6 and
			// 4 as neighbors) this should find the path
			// from 1 to 5, i.e., an array [1,2,3,4,5]
			var getPath = pathFinders.dijsktraHelper.getPath;
			var endingVertice = 5
			var from = {
				1: null,
				2: 1,
				3: 2,
				4: 3,
				5: 4,
				6: 5,
				7: 6
			};
			var path = getPath(from, endingVertice);
			expect(path).to.deep.equal([1,2,3,4,5])
		});

	});

	describe('Integration testing: That it can find paths', function(){

		it("It can return the path for a simple 1d route", function(){

			var [path,_] = dijkstra(lineGraph, 1, 7);
			expect(path).to.deep.equal([1,2,3,4,5,6,7])

		});

		it('It can return the path for a very simple 2d route', function(){

			var [pathOne,_] = dijkstra(planeGraph, [1,1], [1,3]);
			var [pathTwo,_] = dijkstra(planeGraph, [3,1], [1,1]);
			expect(pathOne).to.deep.equal([[1,1],[1,2],[1,3]])
			expect(pathTwo).to.deep.equal([[3,1],[2,1],[1,1]])

		});

	});

});

describe('astar finds paths', function(){

	describe('Unit Testing: Sub-sections used in finding paths work', function(){

		it('estimatorMaker: Helps get manhattan distance between a start and ending', function(){
				var fn = pathFinders.astarHelper.estimatorMaker;
				expect(typeof fn([1,1])).to.equal('function');
				expect(fn([1,1])([2,2])).to.equal(2);
				expect(fn([1,1])([1,2])).to.equal(1);
		});

		it('aInit: Returns closedSet, openSet, fromStart, gScore, fScore in an object', function(){

			var fn = pathFinders.astarHelper.aInit;
			var startVertex = [1,1]
			var endVertex = [2,2]
			var estimator = pathFinders.astarHelper.estimatorMaker(endVertex)
			var {closedSet, openSet, from, gScore, fScore} = fn(startVertex, estimator);

			expect(closedSet != undefined).to.equal(true)
			expect(openSet != undefined).to.equal(true)
			expect(from != undefined).to.equal(true)
			expect(gScore != undefined).to.equal(true)
			expect(fScore != undefined).to.equal(true)

			//The open set has the starting vertice only, to start with
			expect(openSet['1,1'] == startVertex).to.equal(true)
			//While gScore is set for zero for that vertice, because there 
			//is no cost to getting to it.
			expect(gScore['1,1'] == 0).to.equal(true)
			//fScore should be set to the initial estimated
			//distance between the start and the end
			expect(fScore['1,1'] == estimator([1,1])).to.equal(true)
			
		});

	});

	describe('Integration testing: That it can find paths', function(){

		it("It can return the path for a simple 1d route", function(){
			var [path,_] = astar(lineGraph, 1, 7);
			expect(path).to.deep.equal([1,2,3,4,5,6,7])
		});

		it('It can return the path for a simple 2d route', function(){
			var [pathOne,_] = astar(planeGraph, [1,1], [1,3]);
			var [pathTwo,_] = astar(planeGraph, [3,1], [1,1]);
			expect(pathOne).to.deep.equal([[1,1],[1,2],[1,3]])
			expect(pathTwo).to.deep.equal([[3,1],[2,1],[1,1]])

		});

	});

});


