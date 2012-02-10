define(
    ['map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'map/MapObject', 'Mouse', 'Canvas', 'layers/canvas/CanvasLayer', 'layers/canvas/CanvasImageLayer', 'layers/DomLayer', 'layers/DomImageLayer'  , 'jquery'],
    function (MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, MapObject, Mouse, Canvas, CanvasLayer, CanvasImageLayer, DomLayer, DomImageLayer, $) {
        return function () {
            canvas = new Canvas({
                size:[$('body').width(), $('body').height()],
                id:'canvas',
                containerId:'body'
            });
            ctx = canvas.context;
            ctx.fillRect(0, 0, 100, 100);


            l1 = new DomImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[300, 300],
                offset:[-200, 0]
            });
            l2 = new DomImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[50, 50],
                offset:[200, 100],
                //visible:false,

            });
            $.when(l1.loaded, l2.loaded).done(function () {
                l2.setParent(l1).update();
                //layer.setOffset([0,-120]);
                l2.on('mousemove',
                    function () {
                        l2.$el.css({outline:'1px solid red'});
                    }).on('mouseleave', function () {
                        l2.$el.css({outline:'none'});
                    });

            });

            c1 = new CanvasImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[300, 300],
                fit:CanvasImageLayer.fit.ORIGINAL,
                offset:[0, 0]
            });
            c2 = new CanvasImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[50, 50],
                offset:[200, 100]
                //visible:false,

            });

            $.when(c1.loaded, c2.loaded).done(function () {
                c2.setParent(c1);
                c1.update();
                //c1;
                c1.draw();
                c2.draw();
            });
        }
    });
