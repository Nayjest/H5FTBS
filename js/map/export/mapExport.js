/**
 * Returns serialized map, you can save it to file and then load using following code:
 * <code>
 *     var map;
 *     Map.load('map_file_name', function (m) {
 *          map = m;
 *     }
 * </code>
 */
define(['jquery', 'Loadable'], function ($, Loadable) {
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

            var _unitConfigs = {},
                _wait = [];

            for (var i = map.units.length; i--;) {
                if (map.units[i].loadedFrom) {
                    if (!_unitConfigs[map.units[i].loadedFrom]) {
                        _unitConfigs[map.units[i].loadedFrom] = true;
                        (function (i) {
                            _wait.push(Function.load(map.units[i].loadedFrom, function (res) {
                                console.log('Loading unit result:', res);
                                _unitConfigs[map.units[i].loadedFrom] = res;
                            }, true));
                        })(i);
                    }
                }
            }
            var deferred = $.Deferred();
            $.when.apply($, _wait).done(function () {
                var unitConfig;
                console.log('unitConfigs', _unitConfigs);
                for (var i = map.units.length; i--;) {
                    if (map.units[i].loadedFrom) {
                        unitConfig = $.extend(true, {}, _unitConfigs[map.units[i].loadedFrom]);
                        unitConfig.x = map.units[i].mapCell.x;
                        unitConfig.y = map.units[i].mapCell.y;
                        json.units.push(unitConfig);
                    }
                }
                deferred.resolve(JSON.stringify(json));
            });
//
//            for (var i = map.objects.length; i--;) {
//                if (map.objects[i].loadedFrom)
//                    json.objects.push(map.objects[i].loadedFrom)
//            }


//            var strMap = JSON.stringify(json);
//            //strMap = wrapToModule(strMap);
//            return strMap;
            return deferred.promise();
        }
    }
    return me;
});