var Keyboard = {
	keyNames:[],
	
	onKeyDown:function(e) {
		console.log(e.keyCode);
		this[Keyboard.keyNames[e.keyCode]] = true;	
	},
	onKeyUp:function(e) {
		this[Keyboard.keyNames[e.keyCode]] = false;	
	},
	init:function(){
		document.onkeydown = this.onKeyDown;
		document.onkeyup = this.onKeyUp;
	},
}
with (Keyboard) {
	keyNames[37] = "keyLeft";
	keyNames[38] = "keyUp";
	keyNames[39] = "keyRight";
	keyNames[40] = "keyDown";
	keyNames[13] = "keyEnter";

}