const err = function(msg){ throw new Error(msg); }
const copy = function(obj){ return JSON.parse(JSON.stringify(obj))}

function Graph(neighborFn, identFn, toStr){

	this.neighborFn = neighborFn;
	this.identFn = identFn || function(a,b){return a.toString() == b.toString();};
	this.toStr = toStr || function(n){return n.toString()};
}

Graph.prototype.neighbors = function(vertice){
	return this.neighborFn(vertice);
}
Graph.prototype.equals = function(verticeOne, verticeTwo){
	return this.identFn(verticeOne, verticeTwo);
}
Graph.prototype.vertToStr = function(vertice){
	return this.toStr(vertice);
}

module.exports = Graph;