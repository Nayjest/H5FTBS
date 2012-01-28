require(
    [
        'map/MapGenerator',
        'TurnBasedGame', 
        'map/gex/Gex', 
        'Player', 
        'tbsGame/TbsUnit',
        'Mouse',
        'jquery'
    ],
  function(MapGenerator,TurnBasedGame,Gex,Player,TbsUnit, Mouse, $){
  
    $(document).ready(function(){

        // prevent selecting
        $('.noselect').live('selectstart dragstart', function(evt){ evt.preventDefault(); return false; });


        map = MapGenerator.create({size:[15,6],cellSize:[74,64]}).fill(Gex.generators.grass).map;

        game = new TurnBasedGame({
            map:map,
            players:[
            new Player,
            new Player
            ]
        });    

        TbsUnit.load('unit/human/peasant/peasant',function(u){            
            u1 = u.placeTo(map,1,1).setPlayer(1);
        });
        TbsUnit.load('unit/human/peasant/peasant',function(u){
            u2 = u.placeTo(map,1,3).setPlayer(1);
        });
        
        
        

        u3 = new TbsUnit({
            moves:4,            
            maxMoves:4,
            layer:{
                size:[52,80],
                offset:[0,0],
                tag:'div',

                attr:{
                    'class':'noselect',                
                },            
                css:{            
                    zIndex:99999,
                    position:'absolute',
                    backgroundImage:'url(/img/units/Elvish_archer/ea1.png)',
                    backgroundSize:'cover',
                    '-webkit-background-size':'cover',
                    backgroundPosition:'center'
                }
            }
        }).placeTo(map,7,2).setPlayer(2);

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
        $('body').click(function(e){
            if (e.srcElement==$('body').get(0)) {
                map.selectCell(null);
            }
        });
        Mouse.init($('body')[0]);        
    });

});