/**
 *  module CanvasLayer
 */
define(['layers/AbstractLayer', 'Canvas', /*'layers/canvas/CanvasLayerEvents',*/ 'jquery', 'Loadable'], function (AbstractLayer, Canvas, /*CanvasLayerEvents,*/ $) {
    "use strict";
    //Best way to get global object (window in browser) in strict mode
    var FN = Function, glob = FN('return this')();

    // radians in one degree
    var radInDeg = Math.PI / 180;
    // instances counter
    var _id = 0;
    var defaults = {
        visible:true,
        drawMethod:function () {
            throw new Error('CanvasLayer is abstract class it can not be drawn.');
        }
    }

    //define as CanvasLayer for better class detection in Chrome
    var CanvasLayer = function (config) {
        var options = glob.merge({zIndex:1}, config);
        glob.mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
        this.setCanvas(options.canvas);
        this._eventHandlers = [];
        //save link to instance
        Me.instances[_id] = this;
        this.id = _id;
        _id++;
    }
    var Me = CanvasLayer.inheritsFrom(AbstractLayer).extendProto({
        draw:function () {
            if (this.visible) this.drawMethod();
        },
        getAbsoluteOffset:function () {
            var offset = Me.superProto.getAbsoluteOffset.call(this);
            var $el = $(this.canvas.domElement);
            //offset[0] += ~~$el.width()/2;
            //offset[1] += ~~$el.height()/2;
            offset[0] += ~~$('body').width() / 2;
            offset[1] += ~~$('body').height() / 2;
            return offset;
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
        },
        destroy:function () {
            //return;
            if (Me.instances[this.id]) delete(Me.instances[this.id]);
            Me.superProto.destroy.call(this);
        },

        /**
         * Position of the top left
         * @todo window.pageXOffset if not crossbrowser feature
         * @todo with rotation?
         */
        getScreenPos:function () {
            var pos = this.getAbsoluteOffset();
            return [pos[0] - ~~(this.size[0] / 2), pos[1] - ~~(this.size[1] / 2)];
        },
        getCenterScreenPos:function () {
            var pos = this.getScreenPos();
            return [pos[0] + ~~(this.size[0] / 2), pos[1] + ~~(this.size[1] / 2)];
        },
        /**
         *
         * @param string eventName
         * @param function handler
         */
        on:function (eventName, handler) {
            var callbacks = this._eventHandlers[eventName];
            if (!callbacks) {
                callbacks = $.Callbacks();
                this._eventHandlers[eventName] = callbacks;
            }
            callbacks.add(handler);
        },
        fireEvent:function (eventName, args) {
            var $callbacks = this._eventHandlers[eventName];
            if ($callbacks) {
                $callbacks.fireWith(this, args);
            }
        }

    });
    Me.instances = [];
    /**
     * Sort layers by zIndex for drawing
     * @param Array[CanvasLayer] layers
     */
    Me.sortByZIndex = function(layers) {
        return layers.sort(function(a,b){
            return a.zIndex - b.zIndex;
        });
    }

    return Me;

});