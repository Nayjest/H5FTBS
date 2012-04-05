/**
 *  module DomLayer
 */

define(['layers/AbstractLayer', 'JqueryEventsMixin', 'jquery', 'Loadable'], function (AbstractLayer, JqueryEventsMixin, $) {

    // radians in one degree
    var radInDeg = Math.PI / 180;
    var DomLayer = function (config) {
        var options = {
            css:{ border:'1px dotted gray' },
            attr:{},
            tag:'div',
            zIndex:0
        };
        if (config) merge(options, config);
        var $el = this.$el = config.$el || $('<' + options.tag + '/>');
        if (options.zIndex) {
            options.css.zIndex = options.zIndex;
        }
        $el.get(0).ownerLayer = this;
        $el.css(options.css);
        $el.attr(options.attr);
        Me.superClass.call(this, options);
        // @todo remove this
        this.update();
    }
    var Me = DomLayer.inheritsFrom(AbstractLayer).extendProto(JqueryEventsMixin, {

        setZIndex:function (zIndex) {
            Me.superProto.setZIndex.call(this, zIndex);
            this.$el.css('z-index', zIndex);
            return this;
        },

        _getNonDomLayersOffset:function () {
            var layer = this,
                x = 0,
                y = 0;
            while (layer = layer.parent) {
                if (!(layer instanceof Me)) {
                    x += layer.offset[0];
                    y += layer.offset[1];
                }
            }
            return [x, y];

        },
        calcDOMOffset:function () {
            //return this.getAbsoluteOffset();
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

            /** @todo exclude it in DOMLayer mode? */
            var nonDomOffset = this._getNonDomLayersOffset();
            return {
                left:parentOffset.left + innerTopRightPos[0] + this.offset[0] * zoom + nonDomOffset[0],
                top:parentOffset.top + innerTopRightPos[1] + this.offset[1] * zoom + nonDomOffset[1]
            }
        },
        setOffset:function (offset) {
            this.offset = offset.slice(0);
            this.$el.offset(this.calcDOMOffset());
            return this;
        },
        setSize:function (size) {
            this.size = size.slice(0);
            this.$el.width(size[0]).height(size[1]);
            this.$el.offset(this.calcDOMOffset());
            return this;
        },
        show:function () {
            this.$el.show();
            return this;
        },
        hide:function () {
            this.$el.hide();
            return this;
        },
        update:function () {
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
            return Me.superProto.update.call(this);

        },
        setParent:function (parent) {
            //Put DOM element inside parent DOM element
            if (parent instanceof Me) {
                this.$parentEl = parent.$el;
                this.$el.appendTo(this.$parentEl);
                this.update();
            } else {
                this.$parentEl = $('body');
                this.$el.appendTo(this.$parentEl);
            }
            return Me.superProto.setParent.call(this, parent);
        },
        destroy:function () {
            this.$el.detach();
            Me.superProto.destroy.call(this);
        },

        /**
         * Position of the top left center
         * @todo window.pageXOffset if not crossbrowser feature
         * @todo with rotation?
         */
        getScreenPos:function () {
            var offset = this.$el.offset();
            return [offset.left - pageXOffset, offset.top - pageYOffset];
        },
        getCenterScreenPos:function () {
            var pos = this.getScreenPos();
            return [pos[0] + ~~(this.size[0] / 2), pos[1] + ~~(this.size[1] / 2)];
        }

    });

    return Me;
});