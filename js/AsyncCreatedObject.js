define(['jquery'], function ($) {
    "use strict";
    function AsyncCreatedObject(config) {
        this.loaded = $.Deferred();
    }

    AsyncCreatedObject.prototype = {
        onLoad:function (callback) {
            this.loaded.done(callback);
            return this;
        },
        _setIsLoaded:function(){
            this.ready = true;
            this.loaded.resolve(this);
        },
        _isLoadedWhen:function(){
            this.loaded = $.when.apply($, Array.slice.call(arguments,0));
        },
        isLoaded:function(){
            return this.loaded.state() === 'resolved'
        }
    }
});