define([], function () {
    "use strict";
    function wrapToModule(source) {
        return 'define([],function(){var export =  ' + source + '; return export;});';
    }

    var me = {
        export:function (map) {
            var json = {},
                cells = [];
            for (var x = map.cells.length; x--;) {
                cells[x] = [];
                for (var y = map.cells[x].length; y--;) {
                    cells[x][y] = map.cells[x][y].loadedFrom;
                }
            }
            json.size = [cells.length, cells[0].length];
            json.cells = cells;

            var strMap = JSON.stringify(json);
            //strMap = wrapToModule(strMap);
            return strMap;
        }
    }
    return me;
});