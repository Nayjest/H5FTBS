if (!this.env) env = {};
env.imageLayerClass = 'layers/canvas/CanvasImageLayer';
define(
    [
        'layers/ImageLayer',
        'widgets/sidebar/Sidebar',
        'map/MapGenerator',
        'map/gex/Gex',
        //'Player',
        // 'tbsGame/TbsUnit',
        // 'Mouse',
        'jquery',
        'map/MapCell',
        //'layers/canvas/CanvasLayerEvents'
    ],
    function (ImageLayer, Sidebar, MapGenerator, Gex, $, MapCell) {
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

            map = MapGenerator.create({size:[5, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;
            $('#sidebar').load('/js/apps/ftbs/mapEditor/res/sidebar.php', function () {
                map.$infoPanel = $('#mapInfo');
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

            (function () {
                var doOnLoad = MapCell.prototype._doOnLoad;
                MapCell.prototype._doOnLoad = function () {
                    doOnLoad.call(this);
                    this.layer.on('click', putCellHandler);
                }
            })();

            // works only for DOMImageLayer
            //map.layer.on('click', putCellHandler);
        }
    }
);