define(['jquery'], function ($) {
    "use strict";
    var _emptyObj = {};
    var _loadedCss = [];
    function Widget(config) {
        var widget = this;
        if (!config) config = _emptyObj;
        if (config.container) widget.container = config.container;
        this.htmlReady = $.Deferred().done(function (html) {
            widget.html = html;
            widget.$el = $(html).appendTo(widget.container);
        });
        // resolve html only when we sure that container is available
        $(function () {
            if (config.html) widget.htmlReady.resolve(config.html);
        });
    }
    Widget.prototype = {
        container: 'body',
        _requireCssFile:function(file) {
            if (file in _loadedCss) return;
            _loadedCss.push(file);
            var link = document.createElement("link");
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = file;
            document.getElementsByTagName('head')[0].appendChild(link);
        },
        _destroy:function(){
            this.$el.detach();
        },
        destroy:function(){
            this.htmlReady.done(this._destroy.bind(this));
        }
    }
    return Widget;
});