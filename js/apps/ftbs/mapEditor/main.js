define(
    ['widgets/sidebar/sidebar', 'map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'mouse', 'jquery'],
    function (sidebar, MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, mouse, $) {
        var putCell = function (srcCell, targetCell) {
            if (!srcCell || !targetCell) return;
            if (srcCell instanceof MapCell) {
                srcCell.placeTo(map, targetCell.x, targetCell.y);
                return;
            } else {
                Gex.load(
                    'map/cell/gex/' + srcCell,
                    function (cell) {

                        cell.onLoad(function(){
                            putCell(cell, targetCell);
                            cell.layer.on('click',putCellHandler);
                        });

                    }
                );
            }

        }

        var putCellHandler = function(){
            putCell($('#cell').val(), map.selectedCell);
        }

        return function () {

            map = MapGenerator.create({size:[5, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;
            $('#sidebar').load('/js/apps/ftbs/mapEditor/res/sidebar.php', function () {
                map.$infoPanel = $('#mapInfo');
            });

            map.layer.on('click', putCellHandler);

        }
    });