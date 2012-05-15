/**
 *  Module JqueryEventsMixin
 *
 *
 *  Usage: extend your class prototype by this object
 *  Example: MyClass.extendProto(JqueryEventsMixin)
 */
define(['jquery'], function ($) {

    var supportedEvents = [
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup'
    ]
    var me = {
        _targetElement:'$el'
    };
    me.on = function (eventName, eventHandler) {
        this[this._targetElement].on(eventName, eventHandler);
        return this;
    }
    me.resetEventHandlers = function () {
        this[this._targetElement].unbind();
    }
    me.setEventHandlers = function (handlers) {
        this.resetEventHandlers();
        for (var eventName in handlers) {
            if (handlers.hasOwnProperty(eventName)) {
                this[this._targetElement].on(eventName, handlers[eventHandler]);
            }
        }
        return this;
    };

    return me;

});
