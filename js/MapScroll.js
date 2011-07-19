Load.js('/js/Keyboard.js');
function MapScroll(speed){
	var offset = [0,0];	
	this.speed = speed?speed:2;
	this.moveUp = function(){
		offset[1]-=this.speed;
	}
	this.moveDown = function(){
		offset[1]+=this.speed;
	}
	this.moveLeft = function(){
		offset[0]-=this.speed;
	}
	this.moveRight = function(){
		offset[0]+=this.speed;
	}
	this.listenKeyboard = function(){
		if (Keyboard.keyUp) this.moveUp();
		if (Keyboard.keyDown) this.moveDown();
		if (Keyboard.keyLeft) this.moveLeft();
		if (Keyboard.keyRight) this.moveRight();
	}
}