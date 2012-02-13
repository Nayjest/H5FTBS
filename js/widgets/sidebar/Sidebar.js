define(['widgets/Widget'], function (Widget) {
	
    // @todo Firefox already have global object sidebar
    var sidebar = new Widget({template:'/js/widgets/sidebar/sidebar.tpl'});	
    return sidebar;
});