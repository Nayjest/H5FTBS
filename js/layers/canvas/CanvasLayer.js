/**
 *  module CanvasLayer
 */
define(['layers/NonDomLayer', 'Canvas', /*'layers/canvas/CanvasLayerEvents',*/ 'jquery', 'Loadable'], function (NonDomLayer, Canvas, /*CanvasLayerEvents,*/ $) {
    "use strict";
    //Best way to get global object (window in browser) in strict mode
    var FN = Function, glob = FN('return this')();

    //define as CanvasLayer for better class detection in Chrome
    var CanvasLayer = function (config) {
        var options = glob.merge({zIndex:1}, config);
        Me.superClass.call(this, options);
        this.setCanvas(options.canvas);
    }
    var Me = CanvasLayer.inheritsFrom(NonDomLayer).extendProto({
        /* defaults */
        visible:true,
        drawMethod:function () {
            throw new Error('CanvasLayer is abstract class it can not be drawn.');
        },
        /* end defaults */
        draw:function () {
            if (this.visible) this.drawMethod();
        },

        /**
         *
         * @param Canvas canvas
         */
        setCanvas:function (canvas) {
            if (!canvas) canvas = Canvas.getDefault();
            this.canvas = canvas;
            this.ctx = canvas.context;
            return this;
        },
        setOffset:function (offset) {
            this.offset = offset.slice(0);
            this.update();
            return this;
        },
        setSize:function (size) {
            this.size = size.slice(0);
            this.update();
            return this;
        },
        show:function () {
            this.visible = true;
            this.update();
            return this;
        },
        hide:function () {
            this.visible = false;
            this.update();
            return this;
        },
        //draw layer with all children
        update:function () {
            this.draw();
            // @todo return CanvasLayer.superProto.update.apply(this,Array.prototype.splice.call(arguments,0));
            Me.superProto.update.call(this);
            return this;
        },
        setParent:function (parent) {
            Me.superProto.setParent.call(this, parent);
            if (parent instanceof Me) {
                // @todo

            }
            return this;
        }
    });

    /**
     * Sort layers by zIndex for drawing
     * @param Array[CanvasLayer] layers
     */
    Me.sortByZIndex = function (layers) {
        return layers.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });
    }

    return Me;

});