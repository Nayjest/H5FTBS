if (!this.env) env = {};
env.imageLayerClass = 'layers/canvas/CanvasImageLayer';
define(
    [
        'layers/ImageLayer',
        //'widgets/sidebar/Sidebar',
        'apps/ftbs/mapEditor/src/sidebar/sidebar',
        'map/MapGenerator',
        'map/gex/Gex',
        //'Player',
        // 'tbsGame/TbsUnit',
        // 'Mouse',
        'jquery',
        'map/MapCell',
        'decorator',
        'map/Map',
        'map/gex/Gex'
        //'layers/canvas/CanvasLayerEvents'
    ],
    function (ImageLayer, sidebar, MapGenerator, Gex, $, MapCell, decorator, Map) {

        var map;

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


        return function () {

            //map = MapGenerator.create({size:[5, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;
            Map.load('map/map/demo1', function (m) {
                map = m;
                m.$infoPanel = $('#mapInfo');
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
                this.layer.on('click', putCellHandler);
            });

            // works only for DOMImageLayer
            //map.layer.on('click', putCellHandler);
        }
    }
);