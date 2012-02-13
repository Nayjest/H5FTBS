require(
    [
        'Mouse',
        'jquery',
        'apps/' + window.main,
        'lib/es5-shim/es5-shim'
    ],
    function (Mouse, $, main) {

        $(document).ready(function () {

            // prevent selecting
            $('.noselect, #area *').live('selectstart dragstart', function (evt) {
                evt.preventDefault();
                return false;
            });


            main();

            //
            $('body').click(function (e) {
                if (e.srcElement == $('body').get(0)) {
                    map.selectCell(null);
                }
            });
            Mouse.init($('body')[0]);
        });

    });
