define(['widgets/Widget'], function (Widget) {
    "use strict";
    var MapEditorSidebar = function (config) {
        Me.superClass.call(this, config);
    },
        Me = MapEditorSidebar;
    Me.inheritsFrom(Widget);
    Me.extendProto({
        tplSrc:'/js/apps/ftbs/mapEditor/src/sidebar/mapEditorSidebar.tpl'
    });
    return Me;
});