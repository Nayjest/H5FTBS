define(['widgets/Widget'], function (Widget) {
    if (!this.sidebar)
        sidebar = new Widget({template:'/js/widgets/sidebar/sidebar.tpl'});

    return sidebar;
});