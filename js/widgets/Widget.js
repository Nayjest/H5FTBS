/**
 * Widget
 */
define(['jquery', 'jquery.tmpl', 'Class'], function ($) {
    /**
     * This class have asynchronous constructor
     * (it can return deferred object instead of widget instance)
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
     *      container -- selector of DOM element that will contain widget
     *
     *
     * @param config
     */
    Widget = function (config) {
        if (config) merge(this, config);
        this.update(this.onReady);
        return this;
    }

    Widget.prototype = {

        data:{},
        tplSrc:'',
        tplBody:'',
        container:'body',
        onReady:null,

        update:function (onUpdate) {
            if (this.tplBody) {
                this.$el = $($.tmpl(this.tplBody, this.data)).appendTo(this.container);
                if (onUpdate) onUpdate.call(this);
                return this;
            } else {
                var me = this;
                return $.get(this.tplSrc, {}, function (tplBody) {
                    me.tplBody = tplBody;
                    me.update(onUpdate);
                });
            }
        }
    }
    return Widget;
});