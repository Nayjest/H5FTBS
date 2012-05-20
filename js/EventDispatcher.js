define(['decorator'], function (decorator) {
    function EventDispatcher() {
    }
    EventDispatcher.prototype = {
        on:function (eventName, handler) {
            decorator.decorateAfter(this, eventName, handler);
        }
    }
    return EventDispatcher;
});