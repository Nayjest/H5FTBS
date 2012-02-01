define(
    ['map/MapGenerator', 'TurnBasedGame', 'map/gex/Gex', 'Player', 'tbsGame/TbsUnit', 'map/MapObject', 'Mouse', 'Canvas', 'layers/canvas/CanvasLayer', 'layers/canvas/CanvasImageLayer'  , 'jquery'],
    function (MapGenerator, TurnBasedGame, Gex, Player, TbsUnit, MapObject, Mouse, Canvas, CanvasLayer, CanvasImageLayer, $) {
        return function () {
            canvas = new Canvas({
                size:[$('body').width(), $('body').height()],
                id:'canvas',
                containerId:'body'
            });
            ctx = canvas.context;
            ctx.fillRect(0, 0, 100, 100);

            layerConfig = {
                size:[300, 300],
                offset:[-500, 0],
                tag:'div',
                attr:{
                    'class':'noselect',
                },
                css:{
                    zIndex:99999,
                    position:'absolute',
                    backgroundImage:'url(/res/map/terrain/stone/img/5_blue_spiral.png)',
                    backgroundSize:'cover',
                    '-webkit-background-size':'cover',
                    backgroundPosition:'center'
                }
            }
            layerConfig2 = {
                size:[50, 50],
                offset:[0, 0],
                tag:'div',
                attr:{
                    'class':'noselect',
                },
                css:{
                    zIndex:99999,
                    position:'absolute',
                    backgroundImage:'url(/res/map/terrain/stone/img/5_blue_spiral.png)',
                    backgroundSize:'cover',
                    '-webkit-background-size':'cover',
                    backgroundPosition:'center'
                }
            };
            layer = new DOMLayer(layerConfig);
            layer2 = new DOMLayer(layerConfig2);
            layer2.setParent(layer).update();
            //layer.setOffset([0,-120]);
            layer2.setOffset([100, 100]);
            layer.on('mousemove',
                function () {
                    layer.$el.css({outline:'1px solid red'});
                }).on('mouseleave', function () {
                    layer.$el.css({outline:'none'});
                });
            cl = new CanvasImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[300, 300],
                offset:[100, 0]
            });
            cl2 = new CanvasImageLayer({
                image:'/res/map/terrain/stone/img/5_blue_spiral.png',
                size:[50, 50],
                offset:[200, 100],
                visible:false,

            });

            cl.onLoad(function () {
                cl2.onLoad(function () {
                    cl2.setParent(cl).show().update();
                });

            });


        }
    });
