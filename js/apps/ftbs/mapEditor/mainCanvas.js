if (!this.env) env = {};
env.imageLayerClass = 'layers/canvas/CanvasImageLayer';
define(
    ['layers/canvas/CanvasLayer', 'widgets/sidebar/sidebar', 'map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'Mouse', 'jquery', 'layers/canvas/CanvasLayerEvents'],
    function (CanvasLayer, sidebar, MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, Mouse, $) {
        var putCell = function (srcCell, targetCell) {
            if (!srcCell || !targetCell) return;
            if (srcCell instanceof MapCell) {
                srcCell.placeTo(map, targetCell.x, targetCell.y);
                //srcCell.layer.update();
                return;
            } else {
                console.log('put ', srcCell, ' to ', targetCell.x, ':', targetCell.y);
                Gex.load(
                    'map/cell/gex/' + srcCell,
                    function (cell) {
                        putCell(cell, targetCell);
                    }
                );
            }

        }


        return function () {

            map = MapGenerator.create({size:[5, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;
            $('#sidebar').load('/js/apps/ftbs/mapEditor/res/sidebar.php', function () {
                map.$infoPanel = $('#mapInfo')
            });
            map.cells.forEach(function (row) {
                row.forEach(function (cell) {
                    cell.onLoad(function () {
                        cell.layer.on('click', function () {
                            console.log('direct cell click');
                            putCell($('#cell').val(), map.selectedCell);
                        });
                    });
//
                });
            })
            map.layer.on('click', function () {
                console.log('map.layer.click');
                putCell($('#cell').val(), map.selectedCell);
            });
        }
    }
)
;