/**
*  module DomLayer
*/
define(['layers/AbstractLayer', 'JqueryEventsMixin', 'jquery', 'Loadable'], function(AbstractLayer, JqueryEventsMixin, $) {

    // radians in one degree
    var radInDeg = Math.PI / 180;

    var DomLayer = function (config) {
        this.tag = config.tag || 'div';
        this.$el = $('<' + this.tag + '/>');
        DomLayer.superClass.call(this, config);
        mergeUndefined(this, {
            css: { border: '1px dotted gray' },
            attr: {},
            $parentEl:$('body')
        });
        this.$el.get(0).ownerLayer = this;

        this.$el.css(this.css);
        for (var i in this.attr) {
            this.$el.attr(i,this.attr[i]);
        }
        if (!this.parent) {
            this.$el.appendTo(this.$parentEl);
        }
        this.update();
    }
    DomLayer.inheritsFrom(AbstractLayer).extendProto(JqueryEventsMixin, {

        calcDOMOffset:function() {

            var parentOffset = this.$parentEl.offset();
            var zoom = this.getZoom();
            var w = this.size[0] * zoom;
            var h = this.size[1] * zoom;

            var innerTopRightPos = [
                (this.$parentEl.width() - w) / 2,
                (this.$parentEl.height() - h) / 2
            ];

            if (this.angle) {
                var d = Math.sqrt(w * w + h * h);
                var a = (90 - this.angle % 90) * radInDeg;
                innerTopRightPos[1] += (h - d * Math.sin(a + Math.acos(w / d))) / 2;
                innerTopRightPos[0] += (w - d * Math.cos(Math.asin(h / d) - a)) / 2;
            }

            return {
                left: parentOffset.left + innerTopRightPos[0] + this.offset[0] * zoom,
                top: parentOffset.top + innerTopRightPos[1] + this.offset[1] * zoom
            }
        },
        setOffset:function(offset){
            this.offset = offset.slice(0);
            this.$el.offset(this.calcDOMOffset());
            return this;
        },
        setSize:function(size){
            this.size = size.slice(0);
            this.$el.width(size[0]).height(size[1]);
            this.$el.offset(this.calcDOMOffset());  
            return this;
        },
        show:function(){
            this.$el.show();
            return this;
        },
        hide:function(){
            this.$el.hide();
            return this;
        },        
        update:function() {
            //update angle
            var val = 'rotate(' + this.angle + 'deg)';
            this.$el.css({
                '-moz-transform':val,
                '-webkit-transform':val,
                '-o-transform':val,
                transform:val
            });

            //update position and size
            var zoom = this.getZoom();
            this.$el
            .offset(this.calcDOMOffset())
            .width(this.size[0] * zoom)
            .height(this.size[1] * zoom);
            return DomLayer.superProto.update.call(this);

        },
        setParent:function(parent) {
            DomLayer.superProto.setParent.call(this, parent);
            if (parent instanceof DOMLayer) {
                this.$parentEl = parent.$el;
                this.$el.appendTo(this.$parentEl);
                this.update();
            }
            return this;
        },
        destroy:function() {
            this.$el.detach();
            DomLayer.superProto.destroy.call(this);
        },        
        
        /**
        * Position of the top left center
        * @todo window.pageXOffset if not crossbrowser feature
        * @todo with rotation?
        */
        getScreenPos:function() {
            var offset = this.$el.offset();
            return [offset.left - window.pageXOffset, offset.top - window.pageYOffset];
        },        
        getCenterScreenPos:function() {
            var pos = this.getScreenPos();
            return [pos[0]+~~(this.size[0]/2), pos[1]+~~(this.size[1]/2)];
        }

    });        
    
    
    return DOMLayer = DomLayer;

});