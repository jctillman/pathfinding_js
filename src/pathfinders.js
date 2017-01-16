'use strict'



//****************************************
//START FUNCTIONS FOR DIJKSTRA'S ALGORITHM
//****************************************

/*

closestVert:

Input:

	openSet: A object map from vertexId to a vertex, 
	containing all of the open nodes from which one
	wishes to select the closest.
	The format is {vertexId: vertexInstance}, etc.
	So if a vertex was a two-dimensional point formed
	from an array, and if the vertexId was formed
	by vertex.toString(), it would look like this:
	{
		'1,1': [1,1],
		'1,2': [1,2],
		..etc.
	}

	cost: An object map from a vertexId to a cost.
	The format is {vertexId: cost}, etc.
	So if a vertex was a two-dimensional point formed
	from an array, and if the vertexId was formed
	by vertex.toString(), it would look like this:
	{
	    '1,1':0,
	    '1,2':1,
	    ...
	}

Output:
	
	The vertex from openSet for which the cost is least.

*/
var closestVert =  function(openSet, cost){
	const openArr = Object.keys(openSet);
	const initialValue = {
		vertexCost: cost[openArr[0].toString()],
		vertex: openSet[openArr[0]]
	};
	const reduceFunc = (cheapVertex, vertexId) => {
		const vertex = openSet[vertexId];
		const vertexCost = cost[vertexId];
		const alternativeVertice = { vertex, vertexCost };
		return ( vertexCost < cheapVertex.vertexCost) ? alternativeVertice : cheapVertex;
	}
	return openArr.reduce(reduceFunc, initialValue).vertex;
}

/*

getPath:

Input:

	from: A map from a vertexId to a vertex - from
	the id of one vertex to the neighboring vertex
	from which one would come if one were following
	the least-cost path from a starting point.
	I.e., the vertexId is not the id for the vertex
	to which it maps, but is the id for the vertex
	from which one would approach the first vertex
	if one were following the least-cost-path from
	the start.
	Format: {
		'1,2': [1,1],
		'2,2': [1,2],
		etc
	}

	endingVertice: The vertex that we want to find
	the least-cost-path to from the start.

Output:
	
	An array of vertices leading from the starting
	vertex to the ending vertex, along the path of
	least cost defined by from.

*/
var getPath = function(from, endingVertice){
	var path = [];
	var spot = endingVertice;
	while (from[spot.toString()]) {
		path.push(spot);
		spot = from[spot.toString()];
	}
	path.push(spot);
	path.reverse();
	return path;
}

/*

dInit:

Input: startingVertex

	startingVertex: vertex you are starting at

Output:
	
	An object with {closedSet, openSet, from, cost}
	properties.  openSet should be initialized to
	map from the startingVertexId to the starting
	vertex, and cost to map from the startingVertex
	to 0.  The other two should simply be empty 
	objects.

*/

function dInit(startingVertice){
	const startVertId = startingVertice.toString();
	const closedSet = {};
	const openSet = {};
	const from = {};
	const cost = {};
	openSet[startVertId] = startingVertice;
	cost[startVertId] = 0
	return {closedSet, openSet, from, cost};
}

/*

dijkstra:

Input: graph, startingVertice, endingVertice

	graph: An instance of Graph class.  It might be
	useful because it has two methods on it:
	neighbors and equals.

		graph.neighbors takes a vertex and 
		return an array of the neighboring 
		vertices with the cost to get there.
		So it might take, for instance [1,1]
		and return [{neighbor: [1,2], cost: 1},
		{neighbor: [2,1], cost: 1}] and so on.

		graph.equals takes two vertexes and
		returns true if they are equals. This
		might be useful because [1,1] != [1,1]
		in javascript, because arrays are compared
		by reference.

	startVerex: vertex you are starting at

	endVertex: vertex that you want to reach

Output:
	
	An array [path, closedSet]
	
	The path is an array of [vertex, vertex, vertex]
	which will reach from the startVertex to the
	endVertex along the path of least cost.

	The closedSet is just the set of closed nodes,
	so the UI can display how much the algorithm explored.
*/

function dijkstra(graph, startVertex, endVertex){

	const {closedSet, openSet, from, cost} = dInit(startVertex)
	
	while(Object.keys(openSet).length !== 0){
		
		const vertex = closestVert(openSet, cost);
		const vertexId = vertex.toString();
		const vertexCost = cost[vertexId];

		if (graph.equals(endVertex, vertex)){
			const path = getPath(from, endVertex);
			return [path, closedSet];
		}

		delete openSet[vertexId];
		closedSet[vertexId] = true;

		graph.neighbors(vertex).forEach( nAndC => {
			const nVertex = nAndC.neighbor;
			const nTravel = nAndC.cost;
			const nVertexId = nVertex.toString();

			if (closedSet[nVertexId]){return;}
			openSet[nVertexId]=nVertex;

			const totalNeighborCost = vertexCost + nTravel;
			const curCost = cost[nVertexId];
			
			if (totalNeighborCost < curCost || curCost === undefined){
			
				cost[nVertexId] = totalNeighborCost;
				from[nVertexId] = vertex;
			
			}
		})
	}
}



//***********************************
//START FUNCTIONS FOR ASTAR ALGORITHM
//***********************************

/*

estimatorMaker:

Input: endVertex

	endVertex: vertice that one is trying to reach
	It will be an array [n,m] indicating a point
	at the n x m spot in the 2d plane.

Output:
	
	A function that takes a vertex ([n,m]) and returns
	the minimum cost it could take to move from
	that vertex to the endVertex.  In our
	case this is the Manhattan Distance, or the
	L1 norm if you want to be a little more
	mathematical...

	https://en.wiktionary.org/wiki/Manhattan_distance
	https://en.wikipedia.org/wiki/Norm_(mathematics)#Taxicab_norm_or_Manhattan_norm

	In any event, if you called estimatorMaker with
	[1,1] it should return a function, which, if it 
	were called with [1,2] would return 1, or if it 
	were called with [2,3] would return 3.
*/

var estimatorMaker = function(endVertex){
	return (vertex) => {
		return (Math.abs(vertex[0]-endVertex[0])+Math.abs(vertex[1]-endVertex[1]));
	}
}

/*

aInit:

Input: startVertex, estimator

	startVertex: vertex you are starting at.

	estimator: a function taking a vertex, and
	returning the minimum possible optimistic
	cost between that vertex and an ending vertex.

Output:
	
	An object with {closedSet, openSet, from, gScore, fScore}
	properties, with openSet initialized to map from the start
	vertex id to the starting vertice, and gScore to map from
	the starting vertex id to 0, and fScore to map from
	the starting vertex id to the results of estimator(startVertex).

	So basically the whole thing is dInit except with fScore added
	and gScore substituted for cost.
*/

function aInit(startVertex, estimator){
	const startVertId = startVertex.toString();
	const closedSet = {};
	const openSet = {};
	const from = {};
	const gScore = {};
	const fScore = {};
	openSet[startVertId] = startVertex;
	gScore[startVertId] = 0;
	fScore[startVertId] = estimator(startVertex);
	return {closedSet, openSet, from, gScore, fScore};
}

/*

astar:

Input: graph, startingVertice, endingVertice

	These are exactly the same as for the 
	dijkstra function above.

Output:

	An array [path, closedSet].  These are 
	also exactly the same as for the dijkstra 
	function above.

*/

function astar(graph, startVertex, endVertex){

	const estimator = estimatorMaker(endVertex)
	const {closedSet, openSet, from, gScore, fScore} = aInit(startVertex, estimator)
	
	while(Object.keys(openSet).length !== 0){
		
		const vertex = closestVert(openSet, fScore);
		const vertexId = vertex.toString();
		const vertexCost = gScore[vertexId]
		
		if (graph.equals(endVertex, vertex)){
			const path = getPath(from, endVertex);
			return [path, closedSet];
		}

		delete openSet[vertexId];
		closedSet[vertexId] = true;

		graph.neighbors(vertex).forEach( nAndC => {
			const nVertex = nAndC.neighbor;
			const nTravel = nAndC.cost;
			const nVertexId = nVertex.toString();

			if (closedSet[nVertexId]){return;}
			openSet[nVertexId]=nVertex;

			const totalNeighborCost = vertexCost + nTravel;
			const curCost = gScore[nVertexId];
			
			if (totalNeighborCost < curCost || curCost == undefined){
				gScore[nVertexId] = totalNeighborCost;
				const estimated = estimator(nVertex)
				fScore[nVertexId] = totalNeighborCost + estimated;
				from[nVertexId] = vertex;
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