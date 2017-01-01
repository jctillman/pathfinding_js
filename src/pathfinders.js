'use strict'

var initVars =  function(graph, startVertice, maxCost){

	var costFromStart = {};
	var closestToStart = {};
	var	allVertices = graph.allVertices();

	allVertices.forEach(function(vertice){
		const verticeID = graph.vertToStr(vertice)
		costFromStart[verticeID] = maxCost;
		closestToStart[verticeID] = null;
	});

	const startVertId = graph.vertToStr(startVertice)
	costFromStart[startVertId] = 0;

	return {costFromStart, closestToStart, allVertices};
}


var closestVert = function(graph, all, dist){
	const initialValue = {
		verticeDist: dist[graph.vertToStr(all[0])],
		vertice: all[0],
		index: 0};
	const reduceFunc = (closeVertice, vertice, index) => {
		const verticeDist = dist[graph.vertToStr(vertice)];
		return ( verticeDist < closeVertice.verticeDist) ?
				{
					verticeDist: verticeDist,
					vertice: vertice,
					index: index
				} :
				closeVertice;
	}
	const returnVal = all.reduce(reduceFunc, initialValue);

	all.splice(returnVal.index,1);

	return returnVal;
}

var closestVert = function(graph, all, dist){
	const initialValue = {
		verticeDist: dist[graph.vertToStr(all[0])],
		vertice: all[0],
		index: 0};
	const reduceFunc = (closeVertice, vertice, index) => {
		const verticeDist = dist[graph.vertToStr(vertice)];
		return ( verticeDist < closeVertice.verticeDist) ?
				{
					verticeDist: verticeDist,
					vertice: vertice,
					index: index
				} :
				closeVertice;
	}
	const returnVal = all.reduce(reduceFunc, initialValue);

	all.splice(returnVal.index,1);

	return returnVal;
}

var alterMaps = function(graph, vertice, verticeDist, prev, dist){
		graph.successors(vertice).forEach( pAndv => {
			const sucVertice = pAndv[0];
			const sucDist = pAndv[1];
			const verticeID  = graph.vertToStr(sucVertice);
			const alt = sucDist + verticeDist;
			const curDist = dist[verticeID];
			if (alt < curDist){
				dist[verticeID] = alt;
				prev[verticeID] = vertice;
			}
		});
}

var getPath = function(graph, prev, endingVertice){
	var path = [];
	var spot = endingVertice;
	while (prev[graph.vertToStr(spot)]) {
		path.push(spot);
		spot = prev[graph.vertToStr(spot)];
	}
	path.push(spot);
	path.reverse();
	return path;
}


const MAX_COST = 100000
function dijkstra(graph, startingVertice, endingVertice){

	//This step simply initializes all the variables.
	//1) Dist is an object mapping from vertice id -> distance to starting vertice.
	//   This should be initialized to max_cost except for the starting vertice,
	//   where it should naturally be set to zero.
	//2) Prev is an object mapping from vertice id -> neighboring vertice closest by cost to start.
	//   This should be initialized to null everywhere.
	//3) All is an array of all the vertices that have not yet had their successors expanded.
	//   It should be initialized to contain all the arrays.
	const {costFromStart, closestToStart, allVertices} = initVars(graph, startingVertice, MAX_COST);


	//console.log(costFromStart, closestToStart, allVertices)
	//Loop while all has some members in it AND while
	//the vertice we are exploring is not the ending vertice.
	while(allVertices.length !== 0){

		//Find the unexplored vertice that is closest to the
		//starting vertice, in terms of cost.
		var {vertice, verticeDist} = closestVert(graph, allVertices, costFromStart);

		//Break if we've reached the end.
		if (graph.equals(vertice, endingVertice)){break;}

		//Alter prev and dist with vertice.
		alterMaps(graph, vertice, verticeDist, closestToStart, costFromStart);
	}

	const path = getPath(graph, closestToStart, endingVertice);
	const tmp = costFromStart[endingVertice.toString()]

	return [ path , costFromStart ];
}


var aStarClosestVert =  function(graph, openSet, cost){
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

var estimatorMake = function(endingVertice){
	return (vertice) => {
		return (Math.abs(vertice[0]-endingVertice[0])+Math.abs(vertice[1]-endingVertice[1]));
	}
}


function astar(graph, startingVertice, endingVertice){

	const estimator = estimatorMake(endingVertice)
	const startVertId = graph.vertToStr(startingVertice)

	const closedSet = {}
	const openSet = {[startVertId]: startingVertice}
	const fromStart = {}

	const gScore = {[startVertId]:0};
	const fScore = {[startVertId]:estimator(startingVertice)};
	
	while(Object.keys(openSet).length !== 0){
		
		const vertice = aStarClosestVert(graph, openSet, fScore);
		const verticeId = graph.vertToStr(vertice);
		const verticeDist = gScore[verticeId]
		

		if (graph.equals(endingVertice, vertice)){

			const path = getPath(graph, fromStart, endingVertice);
			const price = gScore[endingVertice.toString()];
			debugger;
			return [path, closedSet];
		}
		//debugger;
		delete openSet[verticeId];
		closedSet[verticeId] = true;
		const neighbors = graph.successors(vertice);

		neighbors.forEach( pAndv => {
			const sucVertice = pAndv[0];
			const sucDist = pAndv[1];
			const sucVerticeId = graph.vertToStr(sucVertice);
			if (closedSet[sucVerticeId]){
				return;
			}else{

				if (!openSet[sucVerticeId]){
					openSet[sucVerticeId]=sucVertice;
				}

				const alt = sucDist + verticeDist;
				const curDist = gScore[sucVerticeId] || MAX_COST;
				
				if (alt < curDist){
				
					gScore[sucVerticeId] = alt;
					fromStart[sucVerticeId] = vertice;
					const estimated = estimator(sucVertice)
					
					fScore[sucVerticeId] = gScore[sucVerticeId] + estimated
				
				}
			}
		})
	}
}


module.exports = {
	dijkstra: dijkstra,
	astar: astar,
	dijsktraHelper: {
		initVars: initVars,
		closestVert: closestVert,
		alterMaps: alterMaps,
		getPath: getPath
	}
}