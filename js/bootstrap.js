require(
    ['url', 'debug/globalizeModules', 'settings'],
    function (url, globalizeModules, settings) {
        // @todo remove in production, move to url router
        if (url.getParams('glob')) {
            settings.globals = true;
        }
        if (settings.globals) {
            if (settings.logLoadedModules) globalizeModules.logLoadedModules = true;
            globalizeModules.enable();
        }
        var route = url.getParams('r') || 'ftbs/play/demo1';

        require(['mouse', 'jquery', 'apps/' + route, 'lib/es5-shim/es5-shim'], function (mouse, $, main) {
            $(document).ready(function () {
                // prevent selecting
                $('.noselect, canvas, body').live('selectstart dragstart', function (evt) {
                    evt.preventDefault();
                    return false;
                });

                main();

                // @todo move event handlers to new MapLayer class
                $('body').click(function (e) {
                    if (e.srcElement == $('body').get(0)) {
                        map.selectCell(null);
                    }
                });
                mouse.init($('body').get(0));
            });
        });

    });
