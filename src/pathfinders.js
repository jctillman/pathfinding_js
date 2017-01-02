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
	const openArr = Object.keys(openSet);
	const initialValue = {
		verticeDist: cost[graph.vertToStr(openArr[0])],
		vertice: openSet[openArr[0]]};
	const reduceFunc = (closestVertice, verticeId) => {
		const vertice = openSet[verticeId];
		const verticeDist = cost[verticeId];
		const alternativeVertice = { verticeDist, vertice };
		return ( verticeDist < closestVertice.verticeDist) ? alternativeVertice : closestVertice;
	}
	return openArr.reduce(reduceFunc, initialValue).vertice;
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
	var path = [];
	var spot = endingVertice;
	while (from[graph.vertToStr(spot)]) {
		path.push(spot);
		spot = from[graph.vertToStr(spot)];
	}
	path.push(spot);
	path.reverse();
	return path;
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
	const startVertId = graph.vertToStr(startingVertice);
	const closedSet = {};
	const openSet = {};
	const fromStart = {};
	const gScore = {};
	openSet[startVertId] = startingVertice;
	gScore[startVertId] = 0
	return {closedSet, openSet, fromStart, gScore};
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

function dijkstra(graph, startingVertice, endingVertice){

	const {closedSet, openSet, fromStart, gScore} = dInit(graph, startingVertice)
	
	while(Object.keys(openSet).length !== 0){
		
		const vertice = closestVert(graph, openSet, gScore);
		const verticeId = graph.vertToStr(vertice);
		const verticeDist = gScore[verticeId]

		if (graph.equals(endingVertice, vertice)){
			const path = getPath(graph, fromStart, endingVertice);
			return [path, closedSet];
		}

		delete openSet[verticeId];
		closedSet[verticeId] = true;

		graph.neighbors(vertice).forEach( nAndC => {
			const neighVertice = nAndC.neighbor;
			const travelDist = nAndC.cost;
			const neighVerticeId = graph.vertToStr(neighVertice);
			if (closedSet[neighVerticeId]){return;}

			if (!openSet[neighVerticeId]){
				openSet[neighVerticeId]=neighVertice;
			}

			const totalNeighborDist = travelDist + verticeDist;
			const curDist = gScore[neighVerticeId];
			
			if (totalNeighborDist < curDist || curDist === undefined){
			
				gScore[neighVerticeId] = totalNeighborDist;
				fromStart[neighVerticeId] = vertice;
			
			}
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
	return (vertice) => {
		return 2*(Math.abs(vertice[0]-endingVertice[0])+Math.abs(vertice[1]-endingVertice[1]));
	}
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
	const startVertId = graph.vertToStr(startingVertice);
	const closedSet = {};
	const openSet = {};
	const fromStart = {};
	const gScore = {};
	const fScore = {};
	openSet[startVertId] = startingVertice;
	gScore[startVertId] = 0;
	fScore[startVertId] = estimator(startingVertice);
	return {closedSet, openSet, fromStart, gScore, fScore};
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

	const estimator = estimatorMaker(endingVertice)
	const {closedSet, openSet, fromStart, gScore, fScore} = aInit(graph, startingVertice, estimator)
	
	while(Object.keys(openSet).length !== 0){
		
		const vertice = closestVert(graph, openSet, fScore);
		const verticeId = graph.vertToStr(vertice);
		const verticeDist = gScore[verticeId]
		
		if (graph.equals(endingVertice, vertice)){
			const path = getPath(graph, fromStart, endingVertice);
			return [path, closedSet];
		}

		delete openSet[verticeId];
		closedSet[verticeId] = true;

		graph.neighbors(vertice).forEach( nAndC => {
			const neighVertice = nAndC.neighbor;
			const travelDist = nAndC.cost;
			const neighVerticeId = graph.vertToStr(neighVertice);
			if (closedSet[neighVerticeId]){return;}

			if (!openSet[neighVerticeId]){
				openSet[neighVerticeId]=neighVertice;
			}

			const totalNeighborDist = travelDist + verticeDist;
			const curDist = gScore[neighVerticeId];
			
			if (totalNeighborDist < curDist || curDist == undefined){
			
				gScore[neighVerticeId] = totalNeighborDist;
				fromStart[neighVerticeId] = vertice;

				const estimated = estimator(neighVertice)
				fScore[neighVerticeId] = gScore[neighVerticeId] + estimated
			
			}
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