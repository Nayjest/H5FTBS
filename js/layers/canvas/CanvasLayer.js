/**
*  module DomLayer
*/
define(['layers/AbstractLayer', 'Canvas', 'Loadable'], function(AbstractLayer, Canvas) {

    // radians in one degree
    var radInDeg = Math.PI / 180;
    var defaults = {
        visible:true,
        drawMethod:function(){
            console.log('CanvasLayer is abstract class it can not be drawn');
        }
    }
    var _getDefaultCanvas = function(){
        return window['canvas'];
    }


    var CanvasLayer = function (config) {
        var options = merge({},config);
        mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
        this.setCanvas(options.canvas);
    }
    var Me = CanvasLayer.inheritsFrom(AbstractLayer).extendProto({
        draw:function(){
          if (this.visible) this.drawMethod.call(this);
        },
        getAbsoluteOffset:function () {
            var offset = Me.superProto.getAbsoluteOffset.call(this);
            var $el = $(this.canvas.domElement);
            //offset[0] += ~~$el.width()/2;
            //offset[1] += ~~$el.height()/2;
            offset[0] += ~~$('body').width()/2;
            offset[1] += ~~$('body').height()/2;
            return offset;
        },
        setCanvas:function(canvas){
          if (!canvas) canvas = _getDefaultCanvas();
          this.canvas = canvas;
          this.ctx = canvas.context;
        },
        setOffset:function(offset){
            this.offset = offset.slice(0);
            this.update();
            return this;
        },
        setSize:function(size){
            this.size = size.slice(0);
            this.update();
            return this;
        },
        show:function(){
            this.visible = true;
            this.update();
            return this;
        },
        hide:function(){
            this.visible = false;
            this.update();
            return this;
        },        
        update:function() {
            // @todo return CanvasLayer.superProto.update.apply(this,Array.prototype.splice.call(arguments,0));
            CanvasLayer.superProto.update.call(this);
            this.draw();
            return this;
        },
        setParent:function(parent) {
            CanvasLayer.superProto.setParent.call(this, parent);
            if (parent instanceof CanvasLayer) {
            // @todo

            }
            return this;
        },
        destroy:function() {
            CanvasLayer.superProto.destroy.call(this);
        },        
        
        /**
        * Position of the top left center
        * @todo window.pageXOffset if not crossbrowser feature
        * @todo with rotation?
        */
        getScreenPos:function() {
            // @todo
            //var offset = this.$el.offset();
            //return [offset.left - window.pageXOffset, offset.top - window.pageYOffset];
        },        
        getCenterScreenPos:function() {
            var pos = this.getScreenPos();
            return [pos[0]+~~(this.size[0]/2), pos[1]+~~(this.size[1]/2)];
        }

    });        
    
    
    return Me;

});