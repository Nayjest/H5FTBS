Load.js('/js/Drawable.js').onComplete(function(){

    function Sprite(width, height, context, url){
        Sprite.superClass.apply(this, arguments);
        this.img = new Image(); 
        this.img.src = url;						
    };
    Sprite.inheritsFrom(Drawable);
    with (Sprite){
        prototype._draw = function(x, y, c){	
            c.drawImage(this.img, x, y);	
        }
    };

});