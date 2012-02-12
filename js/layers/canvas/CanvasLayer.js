/**
 *  module CanvasLayer
 */
define(['layers/AbstractLayer', 'Canvas', 'jquery', 'Loadable'], function (AbstractLayer, Canvas, $) {

    // radians in one degree
    var radInDeg = Math.PI / 180;
    var _id = 0;
    var defaults = {
        visible:true,
        drawMethod:function () {
            console.log('CanvasLayer is abstract class it can not be drawn');
        }
    }

    var _getDefaultCanvas = function () {
        if (this.canvas) return this.canvas;
        return canvas = new Canvas({
            size:[$('body').width(), $('body').height()],
            id:'canvas',
            containerId:'body'
        });
    }


    var CanvasLayer = function (config) {
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
        this.setCanvas(options.canvas);
        this._eventHandlers = [];
        //save link to instance
        Me.instances[_id] = this;
        this._id = _id;
        _id++;
    }
    var Me = CanvasLayer.inheritsFrom(AbstractLayer).extendProto({
        draw:function () {
            if (this.visible) this.drawMethod.call(this);
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
        setCanvas:function (canvas) {
            if (!canvas) canvas = _getDefaultCanvas();
            this.canvas = canvas;
            this.ctx = canvas.context;
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
        update:function () {
            // @todo return CanvasLayer.superProto.update.apply(this,Array.prototype.splice.call(arguments,0));
            Me.superProto.update.call(this);
            this.draw();
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
            if (Me.instances[this._id]) delete(Me.instances[this._id]);
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
        on:function (eventName, handler) {
            var callbacks = this._eventHandlers[eventName];
            if (!callbacks) {
                callbacks = $.Callbacks();
                this._eventHandlers[eventName] = callbacks;
            }
            callbacks.add(handler);
        },
        fireEvent:function(eventName, arguments){
            var $callbacks = this._eventHandlers[eventName];
            if ($callbacks) {
                $callbacks.fireWith(this,arguments);
            }
        }

    });
    Me.instances = {};

    return Me;

});