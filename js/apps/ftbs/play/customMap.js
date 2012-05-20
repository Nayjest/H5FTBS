define(
    ['url', 'widgets/sidebar/Sidebar', 'map/Map', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'map/MapObject', 'mouse', 'jquery', 'apps/ftbs/play/src/bootstrap', 'presenters/TbsGamePresenter', 'presenters/GexMapPresenter'],
    function (url, Sidebar, Map, TurnBasedGame, Gex, Player, TbsUnit, MapObject, mouse, $, bootstrap, TbsGamePresenter, GexMapPresenter) {
        //"use strict";
        return function () {
            var game = new TurnBasedGame({
                map:url.getParams('map'),
                players:[
                    new Player,
                    new Player
                ]
            });
            var sbar = new Sidebar({game:game});
            sbar.htmlReady.done(function () {
                game.map.ready.done(function(){
                    window.mapPresenter = new GexMapPresenter(game.map, {$infoPanel:$('#mapInfo')});
                    new TbsGamePresenter(game);
                })
            });
        }
    });