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
    
    unit = new TbsUnit({
        player: game.players[0],
        layer:{
            size:[42,67],
            offset:[0,0],
            tag:'div',            
            attr:{
                'class':'noselect',
                //src:'/img/units/human/peasant/1b.png'
            },            
            css:{            
                zIndex:99999,
                position:'absolute',
                backgroundImage:'url(/img/units/human/peasant/1b.png)',
                backgroundSize:'cover',
                '-webkit-background-size':'cover',
                backgroundPosition:'center'
            }
        }
    }).placeTo(map,1,1);
    
    unit2 = new TbsUnit({
        player: game.players[0],
        layer:{
            size:[42,67],
            offset:[0,0],
            tag:'div',           
            attr:{
                'class':'noselect',                
            },            
            css:{            
                zIndex:99999,
                position:'absolute',
                backgroundImage:'url(/img/units/human/peasant/1b.png)',
                backgroundSize:'cover',
                '-webkit-background-size':'cover',
                backgroundPosition:'center'
            }
        }
    }).placeTo(map,4,1);
    
    unit3 = new TbsUnit({
        player: game.players[1],
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
    }).placeTo(map,7,2);

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

    console.log(unit);
    //console.log(map.cells[3][3].layer);
    //map.cells[3][3].layer.destroy();
    $('body').click(function(e){
        if (e.srcElement==$('body').get(0)) {
            map.selectCell(null);
        }
    });
});