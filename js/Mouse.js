var Mouse = {
	pos:[0,0],
	capturePosition:function(e){
		
		if(e.offsetX) {//Chrome, IE9
			Mouse.pos = [e.offsetX,e.offsetY];			
		}
		else if(e.layerX) {//FF
			Mouse.pos = [e.layerX-e.target.offsetLeft,e.layerY-e.target.offsetTop];												
		}
		
	},
	init:function(targetDomElement){
		targetDomElement.onmousemove = Mouse.capturePosition;
	}
	
}