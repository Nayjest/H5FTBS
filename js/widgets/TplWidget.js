/**
 * Widget using jQuery templates
 */
define(['widgets/Widget', 'jquery', 'jquery.tmpl', 'Class'], function (Widget, $) {
    var _emptyObj = {};
    function TplWidget (config) {
        if (!config) config = _emptyObj;
        Me.superClass.call(this, config);
        this.data = config.data || {};
        if (config.tplSrc) this.tplSrc = config.tplSrc;
        if (config.tplBody) this.tplBody = config.tplBody;

        if (this.tplBody) {
            this.htmlReady.resolve($.tmpl(tplBody, this.data));
        } else if (this.tplSrc) {
            $.get(this.tplSrc).done(function(tplBody){
                this.htmlReady.resolve($.tmpl(tplBody, this.data));
            }.bind(this));
        }
    };
    var Me = TplWidget;
    Me.inheritsFrom(Widget);
//    Me.extendProto({
//
//    });
    return Me;
});