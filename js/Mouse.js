define([], function(){
    var Mouse = {
        pos:[0,0],
        capturePosition:function(e){
            /* Old, wrong coords
            if(e.offsetX) {//Chrome, IE9
                Mouse.pos = [e.offsetX,e.offsetY];			
            } else if(e.layerX) {//FF
                Mouse.pos = [e.layerX-e.target.offsetLeft,e.layerY-e.target.offsetTop];												
            }
            */
            Mouse.pos = [e.x,e.y];//tested in Chrome only            

        },
        init:function(targetDomElement){
            targetDomElement.onmousemove = Mouse.capturePosition;
        }

    }
    return Mouse;
});