/*
Load
	.js('/js/Class.js')
	.js('/js/Map.js')	
	.js('/js/Drawable.js')	
	.js('/js/Mouse.js')
	.js('/js/Canvas.js')
	.js('/js/FPS.js')	
	.js('/js/Sprite.js')
	.js('/js/Keyboard.js')
    .js('/js/platforms/android/Android.removeAddressBar.js')
;
*/
Load.js(
    '/js/Class.js',
    '/js/Map.js',
    '/js/Drawable.js',
    '/js/Mouse.js',
    '/js/Canvas.js',
    '/js/FPS.js',
    '/js/Sprite.js',
    '/js/Keyboard.js',
    '/js/platforms/android/Android.removeAddressBar.js'
).onComplete(function(){

	FPS.init({});
	
	window.canvas = new Canvas({
		id:'mainCanvas',
		size:[1000,700],	
		containerId:'canvasContainer'
	});
	
	window.mouseCanvas = new Canvas({
		id:'mouseCanvas',
		size:[1000,700],	
		containerId:'canvasContainer'
	});
	
	Mouse.init(mouseCanvas.domElement);
	Keyboard.init();
	
	//tmp	
	window.context = window.canvas.context;
	
	Android.removeAddressBar();
	
	
	var d = new Sprite(10,10,mouseCanvas.context,'/img/cursor/cursor1.png');
	//d.draw(100,100);
	var mapData=[];
	for (var x=0;x<50;x++)
		{
		mapData[x] = [];
		for (var y=0;y<30;y++){			
			mapData[x][y] = new Drawable(10,10);
		}
	}
	var map = new Map(mapData);	
	map.draw();
	//console.log(map.getScreenXY([10,10]));
	
	setInterval(function(){
		//canvas.clear();
		mouseCanvas.clear();
		//map.draw();
		//console.log(Mouse.pos[0]+':'+Mouse.pos[1]);
		d.draw(Mouse.pos);
		FPS.update();
	},10);


});
