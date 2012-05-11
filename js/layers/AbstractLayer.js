/**
 *  module AbstractLayer
 */
define(['Node', 'Class'], function (Node, OOP) {

    var defaults = {
        x:0,
        y:0,
        w:100,
        h:100
    };
    var Me = function (config) {
        if (config) merge(this, config);
        this.offset = config.offset?config.offset:[defaults.x,defaults.y];
        this.size = config.size?config.size:[defaults.w,defaults.h];
        this.setZIndex(config.zIndex ? config.zIndex : 1);
        Node.call(this, config.parent, config.children);
    }

    Me.extendProto(Node.prototype, {
        /* defaults */
        angle:0,
        zoom:1,
        /* end defaults */

        show:OOP.abstractMethod(),
        hide:OOP.abstractMethod(),

        /**
         *
         * @param int zIndex
         */
        setZIndex:function (zIndex) {
            this.zIndex = zIndex;
        },

        /**
         * Update layer on the screen
         */
        update:function () {
            //update children elements
            for (var i in this.children) {
                if (this.children.hasOwnProperty(i)) {
                    this.children[i].update();
                }
            }
            return this;
        },

        setOffset:function (offset) {
            this.offset = offset.slice(0);
            return this;
        },
        setSize:function (size) {
            this.size = size.slice(0);
            return this;
        },

        /**
         *
         * @param callback
         */
        onLoad:function (callback) {
            /* @todo refine callbackarguments */
            callback.call(this, this);
        },

        /**
         * @return int[]
         */
        getAbsoluteOffset:function () {
            var layer = this,
                x = this.offset[0],
                y = this.offset[1];
            while (layer = layer.parent) {
                x += layer.offset[0];
                y += layer.offset[1];
            }
            return [x, y];
        },
        getZoom:function () {
            var zoom = this.zoom;
            var layer = this;
            while (layer = layer.parent) {
                zoom *= layer.zoom;
            }
            return zoom;
        },
        align:function () {
            var p = this.parent;
            if (!p) return this;

            var maxX = Math.abs(this.size[0] * this.zoom - p.size[0]) / this.zoom / 2;
            var maxY = Math.abs(this.size[1] * this.zoom - p.size[1]) / this.zoom / 2;

            this.offset = [
                (Math.abs(this.offset[0]) > maxX) ? Math.abs(this.offset[0]) * maxX / this.offset[0] : this.offset[0],
                (Math.abs(this.offset[1]) > maxY) ? Math.abs(this.offset[1]) * maxY / this.offset[1] : this.offset[1]]
            //@todo: scale on rotation
            return this;
        }
    });

    return Me;

});
