const err = function(msg){ throw new Error(msg); }
const copy = function(obj){ return JSON.parse(JSON.stringify(obj))}

function Graph(vertices, successorFn, identFn, toStr){

	this.vertices = vertices;
	this.successorFn = successorFn;
	this.identFn = identFn || function(a,b){return a.toString() == b.toString();};
	this.toStr = toStr || function(n){return n.toString()};

	const self = this;
	this.vertices.map(successorFn).forEach( successors => {
		successors.forEach( costAndSuccessor => {
			const successor = costAndSuccessor[0];
			const cost = costAndSuccessor[1];
			(typeof cost == 'number') || err("successorFn must return [vertice, costToGoToVertice]");
			(self.identFn(successor, successor)) || err("identity function must return true when called on identical items");
		});
	});

}

Graph.prototype.allVertices = function(){
	return copy(this.vertices);
}
Graph.prototype.successors = function(vertice){
	return this.successorFn(vertice);
}
Graph.prototype.equals = function(verticeOne, verticeTwo){
	return this.identFn(verticeOne, verticeTwo);
}
Graph.prototype.vertToStr = function(vertice){
	return this.toStr(vertice);
}

module.exports = Graph;