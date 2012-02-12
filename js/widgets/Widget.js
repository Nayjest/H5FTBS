define(['jquery','jquery.tmpl', 'Class'], function ($) {
    var defaults = {
        template:'',
        insertTo:'body',
        data:{}
    }
    Widget = function (config) {
        var me = this;
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        me.loading = $.get(options.template, {}, function (templateBody) {
                me.$el = $.tmpl(templateBody, options.data).appendTo(options.insertTo);
        });
    }

    Widget.prototype = {


    }
    return Widget;
});