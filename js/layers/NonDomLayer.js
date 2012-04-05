/**
 *  module NonDomLayer
 */
define(['layers/AbstractLayer', 'jquery', 'Mouse'], function (AbstractLayer, $, Mouse) {
    "use strict";
    // instances counter
    var _id = 0,
        _screen_half_w,
        _screen_half_h,
        _onWindowResize = function () {
            _screen_half_w = ~~($('body').width() / 2);
            _screen_half_h = ~~($('body').height() / 2);
        }
    _onWindowResize();
    $(window).resize(_onWindowResize);


    //define as CanvasLayer for better class detection in Chrome
    var NonDomLayer = function (config) {
        Me.superClass.call(this, config);
        Me.prototype.instances[_id] = this;
        this.id = _id;
        _id++;
        this._eventHandlers = {};
    }
    var Me = NonDomLayer.inheritsFrom(AbstractLayer);
    Me.extendProto({
        instances:{},
        destroy:function () {
            if (Me.prototype.instances[this.id]) {
                delete(Me.prototype.instances[this.id]);
            }
            Me.superProto.destroy.call(this);
        },
        getAbsoluteOffset:function () {
            var offset = Me.superProto.getAbsoluteOffset.call(this);
            offset[0] += _screen_half_w;
            offset[1] += _screen_half_h;
            return offset;
        },
        on:function (eventName, handler) {
            var callbacks = this._eventHandlers[eventName];
            if (!callbacks) {
                callbacks = $.Callbacks();
                this._eventHandlers[eventName] = callbacks;
            }
            callbacks.add(handler);
        },
        fireEvent:function (eventName, options) {
            var $callbacks = this._eventHandlers[eventName];
            if ($callbacks) {
                $callbacks.fireWith(this, options);
            }
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
        }
    });


    $('body').on('mousemove mousedown mouseup click', function (event) {
        var lp, //position of iterated layer
            mp = Mouse.pos, //current mouse position
            l, //current layer
            layers = Me.prototype.instances, //all layers
            args; //arguments passed to callback @todo make it compatible with DOM/jquery events, pass same data
        for (var i in layers) {
            if (!layers.hasOwnProperty(i) || !layers[i].visible) {
                continue;
            }
            l = layers[i];
            lp = l.getScreenPos();
            args = [mp];
            if (// mouse inside element
                (mp[0] > lp[0])
                    && (mp[0] < lp[0] + l.size[0])
                    && (mp[1] > lp[1])
                    && (mp[1] < lp[1] + l.size[1])
                ) {
                if (event.type == 'click') {
                    console.log('click on layer', l);
                }
                if (event.type === 'mousemove' && !l._isHovered) {
                    l._isHovered = true;
                    l.fireEvent('mouseover', args);
                }
                l.fireEvent(event.type, args);

            } else if (l._isHovered) { //mouse outside and obj.isHovered
                l._isHovered = false;
                l.fireEvent('mouseout', args);
            }
        }
    });


    return Me;

});