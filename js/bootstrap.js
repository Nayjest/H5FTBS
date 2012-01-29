require(
    [
        'Mouse',
        'jquery',
        'apps/' + window.main
    ],
    function (Mouse, $, main) {

        $(document).ready(function () {

            // prevent selecting
            $('.noselect').live('selectstart dragstart', function (evt) {
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