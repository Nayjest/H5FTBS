/**
 *  module CanvasLayerEvents
 */
define(['jquery', 'Mouse', 'layers/canvas/CanvasLayer', 'Loadable'], function ($, Mouse, CanvasLayer) {

    var _id = 0;

    var CanvasLayerEvents = function () {
        Me.instances[_id] = this;
        this._id = _id;
        _id++;
    }

    var Me = CanvasLayerEvents;
    CanvasLayerEvents.prototype = {
        destroy:function () {
            //return;
            if (Me.instances[this._id]) delete(Me.instances[this._id]);
            Me.superProto.destroy.call(this);
        },
        on:function (eventName, handler) {
            var callbacks = this._eventHandlers[eventName];
            if (!callbacks) {
                callbacks = $.Callbacks();
                this._eventHandlers[eventName] = callbacks;
            }
            callbacks.add(handler);
        },
        fireEvent:function (eventName, arguments) {
            var $callbacks = this._eventHandlers[eventName];
            if ($callbacks) {
                $callbacks.fireWith(this, arguments);
            }
        }

    };
    Me.instances = {};

    var lp, //position of iterated layer
        mp, //current mouse position
        l, //current layer
        layers, //all layer
        args; //arguments passed to callback @todo make it compatible with DOM/jquery events, pass same data
    $('body').on('mousemove mousedown mouseup click', function (event) {
        layers = CanvasLayer.instances;
        mp = Mouse.pos;
        for (var i = layers.length; i--;) {
            if (!(layers[i] && layers[i].visible)) {
                continue;
            }
            l = layers[i];
            lp = l.getScreenPos();
            args = [mp];
            if (// mouse inside element
                (mp[0] > lp[0])
                    && (mp[0] < lp[0] + layers[i].size[0])
                    && (mp[1] > lp[1])
                    && (mp[1] < lp[1] + layers[i].size[1])
                ) {
                if (event.type === 'mousemove') {
                    if (!l._isHovered) {
                        l._isHovered = true;
                        l.fireEvent('mouseover', args);
                    }
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