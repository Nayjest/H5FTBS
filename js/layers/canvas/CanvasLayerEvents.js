/**
 *  module CanvasLayerEvents
 */
define(['jquery', 'Mouse', 'Loadable'], function ($, Mouse) {

    var _id = 0;

    var CanvasLayerEvents = function () {
        Me.instances[_id] = this;
        this._id = _id;
        _id++;
    }
    var Me = CanvasLayerEvents;
    canvasLayerEvents.prototype = {
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

    var lp, mp, l, layers, args;
    $('body').on('mousemove', function () {
        console.log(Me.instances);
        layers = Me.instances;
        mp = Mouse.pos;
        for (var i in layers) {
            if (layers[i].visible) {
                l = layers[i];
                lp = l.getScreenPos();
                args = [mp];
                if (
                    (mp[0] > lp[0])
                        && (mp[0] < lp[0] + layers[i].size[0])
                        && (mp[1] > lp[1])
                        && (mp[1] < lp[1] + layers[i].size[1])
                    ) {

                    l.fireEvent('mousemove', args);
                    if (!l._isHovered) {
                    }
                    l._isHovered = true;
                    l.fireEvent('mouseover', args)
                } else if (l._isHovered) {
                    l._isHovered = false;
                    l.fireEvent('mouseout', args);
                }
            }
        }
    });

    return Me;

});