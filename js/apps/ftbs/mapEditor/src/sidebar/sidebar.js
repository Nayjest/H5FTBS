define(['widgets/Widget'], function (Widget) {
	
    // @todo Firefox already have global object sidebar
    var sidebar = new Widget({
        tplSrc:'/js/apps/ftbs/mapEditor/src/sidebar/sidebar.tpl',
        placeTo:'body'
    });
    return sidebar;
});