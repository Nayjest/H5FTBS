/**
 *  module
 */
define(['Node', 'Class'], function (Node) {

    AbstractLayer = function (config) {
        if (config) mergeUndefined(this, config);
        mergeUndefined(this, {
            /* layer size in pixels */
            size:[100, 100],
            /* offset in pixels */
            offset:[0, 0],
            angle:0,
            zoom:1,
        });
        Node.call(this, config.parent, config.children);
    }

    AbstractLayer.extendProto(Node.prototype, {

        /**
         * Object with prop
         */
        update:function () {
            if (arguments.length === 1) {
                $.extend(this, arguments[0]);
            }
            //update children elements
            for (var i in this.children) {
                this.children[i].update();
            }
            return this;
        },

        //not used yet in DomLayer
        getAbsoluteOffset:function () {
            var layer = this;
            var offset = this.offset;
            while (layer = layer.parent) {
                offset[0] += layer.offset[0];
                offset[1] += layer.offset[1];
            }
            return offset;
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

    return AbstractLayer;

});