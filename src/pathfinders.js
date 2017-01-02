'use strict'

/*

closestVert:

Input:

	graph: An instance of Graph class.  Here only useful
	to convert a vertice to a verticeId with the graph.vertToStr function

	openSet: A map from verticeId to vertices, of all the open 
	nodes from which one wishes to select the closest.
	The format is {verticeId: verticeInstance, verticeId: verticeInstance}, etc.

	cost: A map from a verticeId to a cost.
	The format is {verticeId: cost, verticeId: cost}

Output:
	
	The vertice from openSet for which the cost is least.
*/
var closestVert =  function(graph, openSet, cost){
	//Ten-ish lines of code.
}

/*

getPath:

Input:

	graph: An instance of Graph class.  Here only useful
	to convert a vertice to a verticeId with the graph.vertToStr function

	from: A map from a verticeId to a vertices; from the id of one 
	vertice to the neighboring vertice from which one would come
	if one were following the least-cost path from a starting point.
	I.e., the verticeId is not the id for the vertice, but the id for 
	the vertice which would expect to be approached from the other vertice
	if someone were following the least-cost-path from the start.  

	endingVertice: The vertice towards which we want to find the least cost.

Output:
	
	An array of vertices leading from the starting vertice to the ending vertice,
	along the path of least cost defined by from.
*/
var getPath = function(graph, from, endingVertice){
	//Eight or nine-ish lines of code.
}

/*

dInit:

Input: graph, startingVertice

	graph: An instance of Graph class.  Here only useful
	to convert a vertice to a verticeId with the graph.vertToStr function

	startingVertice: vertice you are starting at

Output:
	
	An object with {closedSet, openSet, fromStart, gScore} properties,
	with openSet initialized to map from the startingVerticeId to the 
	starting vertice, and gScore to map from the startingVerticeId to 0.
*/

function dInit(graph, startingVertice){
	//Sevenish lines.
}

/*

dijkstra:

Input: graph, startingVertice, endingVertice

	graph: An instance of Graph class.  Useful
	to convert a vertice to a verticeId with
	the graph.vertToStr function AND to get neighbors
	with the graph.neighbors function AND to check if
	vertices are identical with the graph.equals function.

	startingVertice: vertice you are starting at

	endingVertice: vertice you want to reach

Output:
	
	An array [path, closedSet]
	
	The path is an array of [vertice, vertice, vertice] which will 
	reach from the startingVertice to the endingVertice
	along the path of least cost.

	The closedSet is just the set of closed nodes,
	so the UI can display how much the algorithm explored.
*/

//This is a large function, so I've written some of it.
function dijkstra(graph, startingVertice, endingVertice){

	//You'll need to write dInit.
	const {closedSet, openSet, fromStart, gScore} = dInit(graph, startingVertice)
	
	while(Object.keys(openSet).length !== 0){
		
		const vertice = closestVert(graph, openSet, gScore);
		const verticeId = graph.vertToStr(vertice);
		//const verticeDist = ?

		if (graph.equals(endingVertice, vertice)){
			//?
		}

		//Do something with the openset and the
		//closed set here, to do with the vertice
		//that we just pulled from the openset.

		graph.neighbors(vertice).forEach( nAndC => {

			//Neighboring vertice
			const neighVertice = nAndC.neighbor; 

			//Cost of traveling from the vertice to the
			//neighboring vertice.
			const travelDist = nAndC.cost;
			
			//This might be useful.									
			const neighVerticeId = graph.vertToStr(neighVertice);

			//Here's the most code you'll need to write unguided
			//in this function.

			//You'll need to make sure (1) that the neighboring
			//vertice isn't in the closed set, (2) potentially
			//add the vertice to the openSet, (3) find the 
			//distance from the start of the vertice, and
			//set gScore appropriately if this is smaller
			//than the current gScore (or if gScore) does not exist
			//for it, and (4) set fromStart if you are setting
			//the gScore.

		})
	}
}


/*

estimatorMaker:

Input: endingVertice

	endingVertice: vertice that one is trying to reach

Output:
	
	A function that takes a vertice, and returns the minimum
	cost it might take (optimistically) to move from that vertice
	to the ending vertice.  In our case this is the Manhattan Distance,
	or the L1 norm if you want to be a little more mathematical...
	https://en.wiktionary.org/wiki/Manhattan_distance
	https://en.wikipedia.org/wiki/Norm_(mathematics)#Taxicab_norm_or_Manhattan_norm
*/

var estimatorMaker = function(endingVertice){
	//A few lines of code.
}

/*

aInit:

Input: graph, startingVertice, estimator

	graph: An instance of Graph class.  Here only useful
	to convert a vertice to a verticeId with the graph.vertToStr function

	startingVertice: vertice you are starting at.

	estimator: a function taking a vertice, and returning the minimum
	possible optimistic cost between that vertice and an ending vertice

Output:
	
	An object with {closedSet, openSet, fromStart, gScore, fScore} properties,
	with openSet initialized to map from the startingVerticeId to the 
	starting vertice, and gScore to map from the startingVerticeId to 0,
	and fScore to estimator(startingVertice).

	So basically the whole thing is dInit except with fScore added.
*/

function aInit(graph, startingVertice, estimator){
	//Ten or so lines
}

/*

dijkstra:

Input: graph, startingVertice, endingVertice

	graph: An instance of Graph class.  Useful
	to convert a vertice to a verticeId with
	the graph.vertToStr function AND to get neighbors
	with the graph.neighbors function AND to check if
	vertices are identical with the graph.equals function.

	startingVertice: vertice you are starting at

	endingVertice: vertice you want to reach

Output:

	An array [path, closedSet]
	
	The path is an array of [vertice, vertice, vertice] which will 
	reach from the startingVertice to the endingVertice
	along the path of least cost.

	The closedSet is just the set of closed nodes,
	so the UI can display how much the algorithm explored.
*/

function astar(graph, startingVertice, endingVertice){

	//You'll need to construct estimatorMaker and aInit
	const estimator = estimatorMaker(endingVertice)
	const {closedSet, openSet, fromStart, gScore, fScore} = aInit(graph, startingVertice, estimator)
	
	while(Object.keys(openSet).length !== 0){
		
		//You may use the same closestVert function as in 
		//dijkstra, but you might want to use different
		//arguments to it...
		//const vertice = ?
		const verticeId = graph.vertToStr(vertice);
		//const verticeDist = ?
		
		if (graph.equals(endingVertice, vertice)){
			//You can use the same thing here as in dijkstra
		}

		//Same thing here to do with openSet
		//and closedSet as in dijkstra.

		graph.neighbors(vertice).forEach( nAndC => {
			//Neighboring vertice
			const neighVertice = nAndC.neighbor; 

			//Cost of traveling from the vertice to the
			//neighboring vertice.
			const travelDist = nAndC.cost;
			
			//This might be useful.									
			const neighVerticeId = graph.vertToStr(neighVertice);

			//Similar here to dijkstra, with some minor changes...
			
		})
	}
}


module.exports = {
	dijkstra: dijkstra,
	astar: astar,
	dijsktraHelper: {
		dInit,
		closestVert,
		getPath
	},
	astarHelper: {
		aInit,
		estimatorMaker
	}
}