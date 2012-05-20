define(
    ['tbsGame/TbsUnit','map/Unit','Player','layers/ImageLayer', 'presenters/GexMapPresenter', 'map/Map', 'widgets/window/WindowWidget', 'widgets/sidebar/Sidebar', 'map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'map/MapObject', 'mouse', 'jquery', 'apps/ftbs/play/src/bootstrap','presenters/PlayerPresenter','presenters/TbsGamePresenter'],
    function (TbsUnit ,Unit, Player,ImageLayer, GexMapPresenter, Map, WindowWidget, Sidebar, MapGenerator, TurnBasedGame, Gex, MapObject, mouse, $, bootsrap, PlayerPresenter, TbsGamePresenter) {
        return function () {
            p1 = new Player;
            p2 = new Player;
            //new WindowWidget({visible:false});
            map = MapGenerator.create({size:[7, 5], cellSize:[74, 64]}).fill(Gex.generators.grass).map;

            game = new TurnBasedGame({
                map:map,
                players:[p1, p2]
            });


            stone = new MapObject({
                passable:false,
                layerSrc:{
                    image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                    size:[50, 50],
                    zIndex:999,
                    _class:ImageLayer
                }
            }).placeTo(map, 0, 0);

            u1 = new TbsUnit({
                hp:1,
                moves:2,
                maxMoves:2,
                layerSrc:{
                    image:'/img/units/Elvish_archer/ea1.png',
                    size:[52, 80],
                    zIndex:600,
                    _class:ImageLayer
                }
            }).placeTo(map, 2, 2).setPlayer(p2);

            u1 = new TbsUnit({
                            moves:1,
                            maxMoves:3,
                            layerSrc:{
                                image:'/img/units/Elvish_archer/ea1.png',
                                size:[52, 80],
                                zIndex:600,
                                _class:ImageLayer
                            }
                        }).placeTo(map, 1, 0).setPlayer(p1);

            u2 = new TbsUnit({
                            moves:2,
                            maxMoves:2,
                            layerSrc:{
                                image:'/img/units/Elvish_archer/ea1.png',
                                size:[52, 80],
                                zIndex:600,
                                _class:ImageLayer
                            }
                        }).placeTo(map, 3, 3).setPlayer(p1);

            sbar = new Sidebar({game:game});
            sbar.htmlReady.done(function () {
                new TbsGamePresenter(game);
                window.mapPresenter = new GexMapPresenter(map, {$infoPanel:$('#mapInfo')});
            });
        }
    });