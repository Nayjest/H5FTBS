
/**
* ==========Drawable class==========
* Represents simple entity that can be drawed on the screen.
*/
function Drawable(width, height, context){
	this.context = context ? context : window.canvas.context;
	this.width = width?width:60;
	this.halfWidth = this.width/2;
	this.height = height?height:30;
	this.halfHeight = this.height/2;
	
	
	
};
with (Drawable){
	prototype._draw = function(x, y, c){
		c.beginPath();
		c.moveTo(x+this.halfWidth,y+this.halfHeight);
		c.lineTo(x+this.halfWidth,y-this.halfHeight);
		c.lineTo(x-this.halfWidth,y-this.halfHeight);
		c.lineTo(x-this.halfWidth,y+this.halfHeight);
		c.strokeStyle = '#666';
		c.lineWidth = 4;
		c.stroke();		
	}
	prototype.draw = function(x, y){
		if (typeof y == 'undefined') {
			return this._draw(x[0],x[1],this.context);
		} else {
			return this._draw(x,y,this.context);
		}				
	}
};