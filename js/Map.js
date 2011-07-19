Load.js('/js/MapScroll.js');

function DefaultMapParams()
{
	this.cellSize = [30,30];
	this.cellsOnScreen = [10,10]	
}
/**
* ==========Map class==========
* Represents game map
*/
function Map(data, context)
{
	DefaultMapParams.call(this);	
	this.data = data;  //level data, 2d array of objects 
	this.width = data.length;
	this.height = data[0].length;		
	this.context = context ? context : window.context;
	this.scroll = new MapScroll();
}
with (Map){
    /**
    * Draw map
    */
	prototype.draw = function(){
		for (var x in this.data) {
			for (var y in this.data[x]) {
				this.data[x][y].draw(this.getScreenXY([x,y]));
			}	
		}
	}
	
	prototype.getObjectAt = function(mapXY){
		return this.data[mapXY[0]][maxXY[1]];
	}
	
	prototype.getScreenXY = function(mapXY){
		return [
			mapXY[0] * this.cellSize[0], 
			mapXY[1] * this.cellSize[1]
		];
	}
	prototype.getMapXY = function(screenXY){
		return [
			screenXY[0] / this.cellSize[0], 
			screenXY[1] / this.cellSize[1]
		];
	}
}