/**
 * Enables rendering via WebGL-2d
 */
define(['Canvas', 'decorator', 'lib/webgl-2d/webgl-2d'],function(Canvas, decorator){
    Canvas.contextName = 'webgl-2d';
    decorator.decorateAfter(Canvas.prototype, '_createDomElement', function(){
        WebGL2D.enable(this.domElement);
    });
});
