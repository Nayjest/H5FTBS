if (!this.env) env = {};
env.imageLayerClass = 'layers/canvas/CanvasImageLayer';
define(
    ['layers/canvas/CanvasLayer', 'widgets/sidebar/sidebar', 'map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'Mouse', 'jquery'],
    function (CanvasLayer, sidebar, MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, Mouse, $) {
        var putCell = function (srcCell, targetCell) {
            if (!srcCell || !targetCell) return;
            if (srcCell instanceof MapCell) {
                srcCell.placeTo(map, targetCell.x, targetCell.y).update();
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
            $('#sidebar').load('/js/apps/ftbs/mapEditor/res/sidebar.php', function () {
                map.$infoPanel = $('#mapInfo')
            });

            map.layer.on('click', function () {
                putCell($('#cell').val(), map.selectedCell);
            });

            var lp, mp, l, layers, args;
            $('body').on('mousemove', function () {
                console.log(CanvasLayer.instances);
                layers = CanvasLayer.instances;
                mp = Mouse.pos;
                for (var i in layers) {
                    if (layers[i].visible) {
                        l = layers[i];
                        lp = l.getScreenPos();
                        args = [mp];
                        if (
                            (mp[0] > lp[0])
                                && (mp[0] < lp[0] + layers[i].size[0])
                                && (mp[1] > lp[1])
                                && (mp[1] < lp[1] + layers[i].size[1])
                            ) {

                                l.fireEvent('mousemove',args);
                                if (!l._isHovered) {}
                                l._isHovered = true;
                                l.fireEvent('mouseover',args)
                        } else if (l._isHovered) {
                            l._isHovered = false;
                            l.fireEvent('mouseout',args);
                        }
                    }
                }
            });

        }
    }
)
;