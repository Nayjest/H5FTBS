
define(['widgets/TplWidget', 'jquery'], function (TplWidget, $) {
    var _emptyObj = {};
    function WindowWidget (config) {
        if (!config) config = _emptyObj;
        if (typeof config.visible !== 'undefined') this.visible = config.visible;
        Me.superClass.call(this, config);
        this._requireCssFile(Me.cssFile);
        this.htmlReady.done(function(){
            if (!this.visible) this.$el.hide(0);
        }.bind(this));
    };
    var Me = WindowWidget;
    Me.cssFile = '/js/widgets/window/window.css';
    Me.inheritsFrom(TplWidget);
    Me.extendProto({
        visible:true,
        tplSrc:'/js/widgets/window/window.tpl'
    });
    return Me;
});