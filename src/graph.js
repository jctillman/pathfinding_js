const err = function(msg){ throw new Error(msg); }
const copy = function(obj){ return JSON.parse(JSON.stringify(obj))}

function Graph(vertices, neighborFn, identFn, toStr){

	this.vertices = vertices;
	this.neighborFn = neighborFn;
	this.identFn = identFn || function(a,b){return a.toString() == b.toString();};
	this.toStr = toStr || function(n){return n.toString()};

	const self = this;
	this.vertices.map(neighborFn).forEach( neighbors => {
		neighbors.forEach( nAndC => {
			const neighbor = nAndC.neighbor;
			const cost = nAndC.cost;
			(typeof cost == 'number') || err("neighborFn must return {neighbor, cost}");
			(neighbor != undefined) || err("neighborFn must return {neighbor, cost}");
			(self.identFn(neighbor, neighbor)) || err("identity function must return true when called on identical items");
		});
	});

}

Graph.prototype.allVertices = function(){
	return copy(this.vertices);
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