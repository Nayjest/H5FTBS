define(
    [
        'layers/ImageLayer',
        //'widgets/sidebar/sidebar',
        'apps/ftbs/mapEditor/src/sidebar/MapEditorSidebar',
        'map/MapGenerator',
        'map/gex/Gex',
        //'Player',
        // 'tbsGame/TbsUnit',
        // 'Mouse',
        'jquery',
        'map/MapCell',
        'decorator',
        'map/Map',
        'settings',
        'map/export/mapExport',
        'url',
        'mouse',
        'tbsGame/TbsUnit',
        'utils'

        //'layers/canvas/CanvasLayerEvents'
    ],
    function (ImageLayer, MapEditorSidebar, MapGenerator, Gex, $, MapCell, decorator, Map, settings, mapExport, url, mouse, TbsUnit, utils) {
        "use strict";
        //Get global object (window in browser) in strict mode
        var FN = Function,
            glob = FN('return this')();

        var map,
            // possible values:'terrain' | 'units' | ...
            mode = 'terrain';

        var sidebar = new MapEditorSidebar();

        /**
         * Puts cell to the map
         *
         * @param string|MapCell srcCell name of MapCell resource or instance of MapCell
         * @param MapCell targetCell
         */
        var putCell = function (srcCell, targetCell) {
            if (!srcCell || !targetCell) return;
            if (srcCell instanceof MapCell) {
                srcCell.placeTo(map, targetCell.x, targetCell.y);
                //srcCell.layer.update();
                return;
            } else {
                MapCell.load(
                    'map/cell/gex/' + srcCell,
                    function (cell) {
                        putCell(cell, targetCell);
                    }
                );
            }
        }

        var putUnit = function (unit, targetCell) {
            if (!unit || !targetCell) return;
            var oldUnit = targetCell.getUnits().pop();
            if (oldUnit) {
                oldUnit.destroy();
            }
            if (unit instanceof TbsUnit) {
                unit.placeTo(map, targetCell.x, targetCell.y);
                //srcCell.layer.update();
                return;
            } else {
                TbsUnit.load(
                    'unit/' + unit,
                    function (unit) {
                        putUnit(unit, targetCell);
                    }
                );
            }
        }

        var putToMapHandler = function () {
            if (mode == 'terrain')
                putCell($('#cell').val(), map.selectedCell);
            else
                putUnit($('#unit').val(), map.selectedCell);
        }

        var saveMap = function (map, name, callback) {
            mapExport.export(map).then(
                function (exported) {
                    console.log('map:', exported);
                    $.post('/backend/mapSave.php', {data:exported, fileName:name}, callback);
                },
                function (exported) {
                    alert('Failed to export map!');
                }
            );
        }

        var onMapSaved = function (response) {
            console.log('Map saved, server responce:', response)
        }


        return function () {
            var mapName = url.getParams('map');
            if (!mapName) {
                mapName = 'map/map/demo1';
            }
            console.log('MAP NAME:', mapName);
            //map = MapGenerator.create({size:[5, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;
            Map.load(mapName, function (m) {
                map = m;
                m.$infoPanel = $('#mapInfo');
                if (settings.globals) {
                    glob.map = map;
                }
            });


            //=================OnClick Event====================================
//            // works both for both, Canvas & DOM ImageLayer
//            map.cells.forEach(function (row) {
//                row.forEach(function (cell) {
//                    cell.onLoad(function () {
//                        cell.layer.on('click', function () {
//                            console.log('direct cell click');
//                            putCell($('#cell').val(), map.selectedCell);
//                            cell.layer.onLoad(function () {
//                                cell.layer.on('click', putCellHandler);
//                            });
//
//                        });
//                    });
//                });
//            });

            decorator.decorate(MapCell.prototype, '_doOnLoad', function () {
                this.layer.on('mouseover', function () {
                    if (mouse.keyPressed[mouse.KEY_LEFT]) putToMapHandler();
                });
                //@todo not works for DOM mode, probably hover layer overlaps cel layer
                this.layer.on('click', putToMapHandler);
            });

            $('#unit').live('click', function () {
                mode = 'units';
            });
            $('#cell').live('click', function () {
                mode = 'terrain';
            });
            $('#btnSave').live('click', function () {
                saveMap(map, $('#mapName').val(), onMapSaved);
            });

            // works only for DOMImageLayer
            //map.layer.on('click', putCellHandler);
        }
    }
);