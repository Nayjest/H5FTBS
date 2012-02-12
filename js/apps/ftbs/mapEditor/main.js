define(
    ['widgets/sidebar/sidebar', 'map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'Mouse', 'jquery'],
    function (sidebar,MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, Mouse, $) {
        var putCell = function (srcCell, targetCell) {
            if (!srcCell || !targetCell) return;
            if (srcCell instanceof MapCell) {
                srcCell.placeTo(map, targetCell.x, targetCell.y);
                return;
            } else {
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
            $('#sidebar').load('/js/apps/ftbs/mapEditor/res/sidebar.php', function(){map.$infoPanel=$('#mapInfo')});

            map.layer.on('click', function () {
                putCell($('#cell').val(), map.selectedCell);
            });

        }
    });