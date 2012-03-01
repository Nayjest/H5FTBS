define([], function(){

    return {
        shadow:function(ctx, x, y, w, h){
            var g = ctx.createRadialGradient(x+w/2, y+w/2, 0, x+w/2, y+w/2, ~~(w/2));
            g.addColorStop(0, 'rgba(0,0,0,0.3)');
            g.addColorStop(0.5, 'rgba(0,0,0,0.2)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(x,y,w,h);
        }
    }

})