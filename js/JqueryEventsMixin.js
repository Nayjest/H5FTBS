/**
*  Module JqueryEventsMixin
*   
* 
*  Usage: extend your class prototype by this object
*  Example: MyClass.extendProto(JqueryEventsMixin)
*/
define(['jquery'], function($) {
    
    var supportedEvents = [
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
    ]
    var Me = {
        _targetElement:'$el',
    };
    Me.on = function(eventName, eventHandler) {
        return this[this._targetElement].on(eventName,eventHandler);
    }
    
    return Me;

});