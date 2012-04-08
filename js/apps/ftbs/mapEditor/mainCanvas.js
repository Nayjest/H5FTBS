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
        'mouse'
        //'layers/canvas/CanvasLayerEvents'
    ],
    function (ImageLayer, MapEditorSidebar, MapGenerator, Gex, $, MapCell, decorator, Map, settings, mapExport, url, mouse) {
        "use strict";
        //Get global object (window in browser) in strict mode
        var FN = Function,
            glob = FN('return this')();

        var map;

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
        var putCellHandler = function () {
            putCell($('#cell').val(), map.selectedCell);
        }

        var saveMap = function (map, name, callback) {
            var exported = mapExport.export(map);
            console.log('map:', exported);
            $.post('/backend/mapSave.php', {data:exported, fileName:name}, callback);
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
                this.layer.on('mouseover', function(){
                    if (mouse.keyPressed[mouse.KEY_LEFT]) putCellHandler();
                });
                //@todo not works, probably hover layer overlaps cel layer
                this.layer.on('click', putCellHandler);
            });


            $('#btnSave').click(function () {
                console.log('Saving map...');
                saveMap(map, $('#mapName').val(), onMapSaved);
                console.log('ok!');
            });

            // works only for DOMImageLayer
            //map.layer.on('click', putCellHandler);
        }
    }
);