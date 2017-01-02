const React = require('react');
const Cell = require('./cell.js');

const Graph = require('../graph.js');
const boardMaker = require('../utils/boardMaker');
const pathFinders = require('../pathfinders');

//***********************************************
//
// WARNING: THIS CODE IS ONLY USED FOR DISPLAYING 
// THINGS RETURNS BY THE DISKSTRA / ASTAR ALGORITHMS.
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
		const height = 20;
		const width = 30;
		const offset = 5;
		this.start = [offset, offset];
		this.end = [height-offset,width-offset]

		const tmpBoard = boardMaker.makeBlank(height,width);
		tmpBoard[this.start[0]][this.start[1]] = 51;
		tmpBoard[  this.end[0]][  this.end[1]] = 52;

		this.state = { board: tmpBoard};
		this.changeTerrainKind = this.changeTerrainKind.bind(this);
	}

	clearBoardOfIndicators(){
		var newBoard = this.state.board.map(row => {
			return row.map( a => {
				if (a > 900) {return a - 1000;}
				if (a > 90) {return a - 100;}
				return a;
			});
		});
		this.state.board = newBoard
		this.setState({board: newBoard});
	}

	changeTerrainKind(x,y,e){
		//console.log(e);
		//Only do anything if the shiftkey is pressed down.
		if(e.shiftKey || e.altKey || e.metaKey){
			this.clearBoardOfIndicators();
			
			//Change the square that we're on
			var tmp = this.state.board;
			if(tmp[x][y] < 10){
				if (e.shiftKey) { var newVal = 1; }
				if (e.altKey) { var newVal = 2;}
				if (e.metaKey) { var newVal = 0;}
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

		const h = this.state.board.length;
		const w = this.state.board[0].length;
		const board = this.state.board;

		var neighborFn = boardMaker.makeNeighborFn(board);
		var graph = new Graph(neighborFn);

		var [path, exploredOrOpen] = fnc(graph, this.start, this.end)
		
		var tmp = this.state.board;

		Object.keys(exploredOrOpen).forEach( (textSpot) => {
			const split = textSpot.split(',');
			const spot = [ parseInt(split[0]), parseInt(split[1])];
			if (exploredOrOpen[textSpot] != 100000){
				tmp[split[0]][split[1]] = tmp[split[0]][split[1]] + 1000;
			}
		})

		path.forEach((spot) => {
			const curVal = tmp[spot[0]][spot[1]]
			console.log(curVal)
			if ([0,1,2,1000,1001,1002].indexOf(curVal) != -1){
				tmp[spot[0]][spot[1]] = (tmp[spot[0]][spot[1]] % 100) + 100;
				console.log(tmp[spot[0]][spot[1]])
			}
		});
		console.log(tmp)
		this.setState({board: tmp});

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


