define(['widgets/Widget'], function (Widget) {
    "use strict";
    var Sidebar = function (config) {
        Me.superClass.call(this, config);
    },
        Me = Sidebar;
    Me.inheritsFrom(Widget);
    Me.extendProto({
        tplSrc:'/js/widgets/sidebar/sidebar.tpl'
    });
    return Me;
});