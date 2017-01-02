import React from 'react'

module.exports = class Cell extends React.Component {

	render () {
		const {content,x,y,change} = this.props;
		var color
		if(content === 0){
			color = "#33BB33";
		}else if(content === 1){
			color = "#555555";
		}else if(content == 2){
			color = "#884411";
		}else if(content == 51){
			color = "red"
		}else if(content == 1051){
			color = "red"
		}else if(content == 52){
			color = "yellow"
		}else if(content == 1052){
			color = "yellow"
		}else if(content == 100){
			color = "#55DD55"
		}else if(content == 101){
			color = "#777777"
		}else if(content == 102){
			color = "#AA6633"
		}else if(content == 1000){
			color = "#119911"
		}else if(content == 1001){
			color = "#333333"
		}else if(content == 1002){
			color = "#662200"
		}else{
			console.log({content, x, y})
			throw new Error("Unidentified piece on board.");
		}

		return (
			<td 
				style={{backgroundColor:color}}
				onMouseOver={(e) => (change(x,y,e))}>
			</td>
			)
	}
	
}

