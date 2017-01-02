const React = require('react');
const Cell = require('./cell.js');

const Graph = require('../graph.js');
const boardMaker = require('../utils/boardMaker');
const pathFinders = require('../pathfinders');
const bv = require('../utils/boardVals');

//***********************************************
//
// WARNING: THIS CODE IS ONLY USED FOR DISPLAYING 
// THINGS RETURNED BY THE DISKSTRA / ASTAR ALGORITHMS.
//
// SO YOU DON'T NEED TO UNDERSTAND HOW IT WORKS TO
// FINISH THE TUTORIAL
//
// But if you reallly want to go ahead and waste your time
// you can read it; it's your life. 
//
//***********************************************

module.exports = class App extends React.Component{
	
	constructor(){

		super();

		//Set height, width, and offset for the 
		//starting and ending points.
		const height = 20;
		const width = 30;
		const offset = 5;

		//Create start and end points.
		this.start = [offset, offset];
		this.end = [height-offset,width-offset]

		//Make a temporary board, then switch board
		//at start and endpoint to make sense.
		const tmpBoard = boardMaker.makeBlank(height,width);
		tmpBoard[this.start[0]][this.start[1]] = bv.START_ORIG;
		tmpBoard[  this.end[0]][  this.end[1]] = bv.END_ORIG;

		//Set the state, and bind the function which 
		//is to be passed to the child.
		this.state = { board: tmpBoard};
		this.changeTerrainKind = this.changeTerrainKind.bind(this);
	}

	clearBoardOfIndicators(){
		var newBoard = bv.switchToOriginalValues(this.state.board)
		this.state.board = newBoard;
		this.setState({board: newBoard});
	}

	changeTerrainKind(x,y,e){

		//Only do anything if some key is pressed down.
		if(e.shiftKey || e.altKey || e.metaKey){

			//If so, change the board so it just has ORIG
			//values, thus wiping indicators of path
			//and of exploration.
			this.clearBoardOfIndicators();
			
			//Change the square that we're on
			var tmp = this.state.board;
			if(tmp[x][y] < 10){
				if (e.shiftKey) { var newVal = bv.WALL_ORIG; }
				if (e.altKey) { var newVal = bv.MUD_ORIG;}
				if (e.metaKey) { var newVal = bv.GRASS_ORIG;}
				tmp[x][y] = newVal;
				this.setState({board: tmp});
			}	
		}
	}

	calcShortestWithD(){
 		this.calcShortest(pathFinders.dijkstra)
	}

	calcShortestWithA(){
		this.calcShortest(pathFinders.astar)
	}

	calcShortest(fnc){
		this.clearBoardOfIndicators();

		//Set up the graph that we will give to the students 
		//code.
		const board = this.state.board;
		var neighborFn = boardMaker.makeNeighborFn(board);
		var graph = new Graph(neighborFn);

		//Invoke the students code, and try to 
		//get values from it
		var [path, closed] = fnc(graph, this.start, this.end)
		
		//Check for errors if the student's code is returning invalid
		//values--try to return something meaningful.
		if (!path){
			console.warn("Algorithm returned no path;."); return;}
		if (!closed){
			console.warn("Algorithm returned no closedSet object."); return;}
		if (!Array.isArray(path)){
			console.warn("Algorithm returned a path object that is not an array."); return;}
		if (!Array.isArray(path[0])){
			console.warn("Members of 'path' array are not vertices (i.e., [height,width])"); return;}
		if (path.length < 5){
			console.warn("'path' array is notably too short."); return;}

		//Get a display board with the values changed
		//so that it is dark or bright depending on 
		//where you've explored.
		var drawn = bv.drawClosedAndPathToBoard(this.state.board,closed,path);

		//Set state.
		this.setState({board: drawn});

	}

	render(){
		return (
			<div className="outer">
				<table id="board">
					<tbody>
						{this.state.board.map( (row, i) => {
							return <tr key = {i}>
								{
									row.map( (element, j) => {
										return <Cell key={`${i}+${j}`} content={element} x={i} y={j} change={this.changeTerrainKind} />
									})
								}
							</tr>
						})}
					</tbody>
				</table><br/>
				<div>
					<div>Shift+Drag to make walls.</div>
					<div>Command+Drag to make grass.</div>
					<div>Option+Drag to make mud.</div>
				</div>
				<div>
				<input
					type="button"
					value="Calculate Shortest Path with Dijkstra"
					onClick={()=>this.calcShortestWithD()}>
				</input><br/>
				<input
					type="button"
					value="Calculate Shortest Path with Astar"
					onClick={()=>this.calcShortestWithA()}>
				</input>
				</div>
			</div>
		);
	}

}


