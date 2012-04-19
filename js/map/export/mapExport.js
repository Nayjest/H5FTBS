/**
 * Returns serialized map, you can save it to file and then load using following code:
 * <code>
 *     var map;
 *     Map.load('map_file_name', function (m) {
 *          map = m;
 *     }
 * </code>
 */
define([], function () {
    "use strict";
    // @todo it's not used now
    function wrapToModule(source) {
        return 'define([],function(){var export =  ' + source + '; return export;});';
    }

    var me = {
        export:function (map) {
            var json = {units:[], objects:[]},
                cells = [];
            for (var x = map.cells.length; x--;) {
                cells[x] = [];
                for (var y = map.cells[x].length; y--;) {
                    cells[x][y] = map.cells[x][y].loadedFrom;
                }
            }
            json.size = [cells.length, cells[0].length];
            json.cells = cells;
            for (var i = map.units.length; i--;) {
                if (map.units[i].loadedFrom)
                    json.units.push(map.units[i].loadedFrom)
            }
            for (var i = map.objects.length; i--;) {
                if (map.objects[i].loadedFrom)
                    json.objects.push(map.objects[i].loadedFrom)
            }

            var strMap = JSON.stringify(json);
            //strMap = wrapToModule(strMap);
            return strMap;
        }
    }
    return me;
});