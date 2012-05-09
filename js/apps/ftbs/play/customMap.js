define(
    ['url','widgets/window/WindowWidget','widgets/sidebar/Sidebar', 'map/Map', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'map/MapObject', 'mouse', 'jquery', 'canvas/canvasUtils', 'utils', 'layers/canvas/CanvasLayer', 'apps/ftbs/play/src/bootstrap'],
    function (url, WindowWidget,Sidebar, Map, TurnBasedGame, Gex, Player, TbsUnit, MapObject, mouse, $, canvasUtils, utils, CanvasLayer) {

        return function () {
            game = new TurnBasedGame({
                map:url.getParams('map'),
                players:[
                    new Player,
                    new Player
                ]
            });
            window.sbar = new Sidebar({
                onReady:function () {
                    window.map.$infoPanel = $('#mapInfo');
                },
                game:game
            });
        }
    });