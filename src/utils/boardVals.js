//***********************************************
//
// WARNING: THIS CODE IS ONLY USED FOR DISPLAYING 
// THINGS RETURNED BY THE DISKSTRA / ASTAR ALGORITHMS.
//
// SO YOU DON'T NEED TO UNDERSTAND HOW IT WORKS TO
// FINISH THE TUTORIAL
//
//***********************************************

const GRASS_ORIG = 0;
const WALL_ORIG = 1;
const MUD_ORIG = 2;
const START_ORIG = 51;
const END_ORIG = 52;

const GRASS_PATH = 0 + 100;
const WALL_PATH = 1 + 100;
const MUD_PATH = 2 + 100;

const GRASS_CLOSED = 0 + 1000;
const WALL_CLOSED = 1 + 1000;
const MUD_CLOSED = 2 + 1000;


const switchToOriginalValues = function(board){
	return board.map(row => {
		return row.map( a => {
			if (a > 900) {return a - 1000;}
			if (a > 90) {return a - 100;}
			return a;
		});
	});
}

const drawClosedAndPathToBoard = function(board, closed, path){

	//Change all the cells that have been closed to the
	//correct color...
	Object.keys(closed).forEach( (textSpot) => {
		const split = textSpot.split(',');
		const spot = [ parseInt(split[0]), parseInt(split[1])];
		if (closed[textSpot] != 100000){
			board[split[0]][split[1]] = board[split[0]][split[1]] + 1000;
		}
	})

	//...And change all the cells that are in 
	//the path to a different color.
	path.forEach((spot) => {
		const curVal = board[spot[0]][spot[1]]
		if ([GRASS_ORIG,WALL_ORIG,MUD_ORIG,GRASS_CLOSED,WALL_CLOSED,MUD_CLOSED].indexOf(curVal) != -1){
			board[spot[0]][spot[1]] = (board[spot[0]][spot[1]] % 100) + 100;
		}
	});

	return board;
}

module.exports = {
	GRASS_ORIG, WALL_ORIG, MUD_ORIG, START_ORIG, END_ORIG,
	GRASS_PATH, WALL_PATH, MUD_PATH,
	GRASS_CLOSED, WALL_CLOSED, MUD_CLOSED,
	switchToOriginalValues,
	drawClosedAndPathToBoard
}