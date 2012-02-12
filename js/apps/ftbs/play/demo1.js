define(
    ['widgets/sidebar/sidebar','map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'map/MapObject', 'Mouse', 'jquery'],
    function (sidebar, MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, MapObject, Mouse, $) {
        return function () {

            map = MapGenerator.create({size:[15, 6], cellSize:[74, 64]}).fill(Gex.generators.grass).map;

            game = new TurnBasedGame({
                map:map,
                players:[
                    new Player,
                    new Player
                ]
            });

            TbsUnit.load('unit/human/peasant/peasant', function (u) {
                u1 = u.placeTo(map, 1, 1).setPlayer(1);
            });
            TbsUnit.load('unit/human/peasant/peasant', function (u) {
                u2 = u.placeTo(map, 1, 3).setPlayer(1);
            });


            stone = new MapObject({
                passable:false,
                layer:{
                    image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                    size:[50, 50]
                }
            }).placeTo(map, 3, 1);

            u3 = new TbsUnit({
                moves:4,
                maxMoves:4,
                layer:{
                    image:'/img/units/Elvish_archer/ea1.png',
                    size:[52, 80]
                }
            }).placeTo(map, 7, 2).setPlayer(2);
            u3.onLoad(function(me){console.log('ok',me); me.layer.update();});

            //    var unit2 = new DomLayer({
            //        size:[63,78],
            //        offset:[100,0],
            //        tag:'img',
            //        attr:{src:'/img/units/Elvish_archer/ea1.png'},
            //        css:{
            //            position:'absolute',
            //            top:0,
            //            left:0,
            //            zIndex:99999,
            //        }
            //    }).setParent(map.layer).update();


            //console.log(map.cells[3][3].layer);
            //map.cells[3][3].layer.destroy();
        }
    });