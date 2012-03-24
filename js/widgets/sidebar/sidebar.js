define(['widgets/Widget'], function (Widget) {
	
    // @todo Firefox already have global object sidebar
    var sidebar = new Widget({
        tplSrc:'/js/widgets/sidebar/sidebar.tpl',
        placeTo:'body'
    });
    return sidebar;
});