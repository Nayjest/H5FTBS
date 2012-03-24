/**
 * Widget
 */
define(['jquery', 'jquery.tmpl', 'Class'], function ($) {
    /**
     * This class have asynchronous constructor
     * (it can return defferred object instead of widget instance)
     *
     * Usage:
     * <code>
     * var myWidget;
     * $.when(new Widget(...)).done(function(obj){
     *     myWidget = obj;
     * })
     * </code>
     *
     * required options:
     *   one of:
     *      tplSrc -- url of template file
     *      tplBody -- template body (html)
     * other supported options:
     *      placeTo -- selector of DOM element that will contain widget
     *
     *
     * @param config
     */
    Widget = function (config) {
        var me = this;
        if (config.tplSrc) {
            return $.get(config.tplSrc, {}, function (templateBody) {
                var options = merge({},config);
                options.tplBody = templateBody;
                me.tplSrc = options.tplSrc;
                delete options.tplSrc;
                return Widget.call(me, options);
            });
        } else if (config.tplBody) {
            me.tplBody = config.tplBody;
            me.$el = $.tmpl(config.tplBody, config.data ? config.data : {});
        } else {
            throw new Error('Widget template not specified: required tplSrc or tplBody properties.');
        }

        if (config.placeTo) {
            me.placeTo(config.placeTo);
        }

        return me;
    }

    Widget.prototype = {
        placeTo:function (targetSelector) {
            $(this.$el).appendTo(targetSelector);
        }
    }
    return Widget;
});