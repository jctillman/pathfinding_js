/* Graph wraps some functions that you would always want to have
	for any graph.  

	Namely, it wraps up--

	1. neighborFn: Takes a vertex, returns an array of {vertice, cost}
	objects where the vertice is a neighboring vertice and the cost is the cost
	to arrive move from the original vertice to the neighboring vertice.

	2. identFn: Takes two vertices and returns true if they are identical

	3. toStr: Takes a vertice, and returns it to a string identifier.
	This is useful when you want to store a (verticeId -> some quality of
	vertice) map in an object.
*/

function Graph(neighborFn, identFn, toStr){

	this.neighborFn = neighborFn;
	this.identFn = identFn || function(a,b){return a.toString() == b.toString();};
	this.toStr = toStr || function(n){return n.toString()};
}

Graph.prototype.neighbors = function(vertex){
	return this.neighborFn(vertex);
}
Graph.prototype.equals = function(vertexOne, vertexTwo){
	return this.identFn(vertexOne, vertexTwo);
}
Graph.prototype.vertToStr = function(vertex){
	return this.toStr(vertex);
}

module.exports = Graph;