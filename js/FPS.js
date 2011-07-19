var FPS = {	
	outputDomElementId:'fpsCounter',
	_outputDomElement:false,
	skipFrames:20,	
	_skippedFrames:0,
	_lastLoop: new Date().getTime(),
	
	update: function () {   
		if (this._skippedFrames < this.skipFrames) {
			this._skippedFrames++;
			return;
		}
		this._skippedFrames = 0;
        var thisLoop = new Date().getTime(); 
		var fps = Math.round((this.skipFrames+1)/(thisLoop - this._lastLoop)*1000);
		this._lastLoop = thisLoop;
		this._outputDomElement.innerHTML = fps;
	},
	
	init:function(params){
		this.prototype = params;
		this._outputDomElement = document.getElementById(this.outputDomElementId);
		if (!this._outputDomElement) {
			this._createOutputDomElement();	
		}
	},
	_createOutputDomElement:function(){
		var el = document.createElement('div');
		el.setAttribute('style', 'position:fixed; right:3px; top:3px; z-index:11;');
		el.setAttribute('id', this.outputDomElementId);
		document.getElementsByTagName('body')[0].appendChild(el);
		this._outputDomElement = el;	
	}
}