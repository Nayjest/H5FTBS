require(
    ['url', 'debug/GlobalizeModules'],
    function (url, GlobalizeModules) {
        // @todo remove in production, move to url router
        if (url.getParams('glob')) {
            GlobalizeModules.start();
        }
        var route = url.getParams('r') || 'ftbs/play/demo1';

        require(['Mouse', 'jquery', 'apps/' + route, 'lib/es5-shim/es5-shim'], function (Mouse, $, main) {
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
                Mouse.init($('body')[0]);
            });
        });

    });
