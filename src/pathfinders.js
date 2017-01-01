'use strict'

var closestVert =  function(graph, set, cost){
	const openArr = Object.keys(set);
	const initialValue = {
		verticeDist: cost[graph.vertToStr(openArr[0])],
		vertice: set[openArr[0]]};
	const reduceFunc = (closestVertice, verticeId) => {
		const vertice = set[verticeId];
		const verticeDist = cost[verticeId];
		const alternativeVertice = { verticeDist, vertice };
		return ( verticeDist < closestVertice.verticeDist) ? alternativeVertice : closestVertice;
	}
	return openArr.reduce(reduceFunc, initialValue).vertice;
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

const MAX_COST = 100000
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
			const curDist = gScore[neighVerticeId] || MAX_COST;
			
			if (totalNeighborDist < curDist){
			
				gScore[neighVerticeId] = totalNeighborDist;
				fromStart[neighVerticeId] = vertice;
			
			}
		})
	}
}




var estimatorMaker = function(endingVertice){
	return (vertice) => {
		return (Math.abs(vertice[0]-endingVertice[0])+Math.abs(vertice[1]-endingVertice[1]));
	}
}

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
			const curDist = gScore[neighVerticeId] || MAX_COST;
			
			if (totalNeighborDist < curDist){
			
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