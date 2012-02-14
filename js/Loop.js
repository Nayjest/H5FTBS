var Loop = function (delay){
	var _delay = delay;
	var _status = Loop.STATUS_STOP;
	var _interval;
	var _instructions = [];
    var i;
	this.run = function(){
		for (i = _instructions.length;i--;) {
			_instructions[i]();	
		}
	}
	
	function start(){
		_interval = setInterval(this.run,_delay);
		_status = Loop.STATUS_RUN;
	}
	function stop(){
		clearInterval (_interval);
		_status = Loop.STATUS_STOP;
	}
	function pause(delay){
		clearInterval (_interval);
		_status = Loop.STATUS_PAUSE;
		setInterval(function(){this.start()},delay);
	}
}
Loop.STATUS_RUN = 1;
Loop.STATUS_PAUSE = 2;
Loop.STATUS_STOP = 2;
