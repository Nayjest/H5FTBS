define(['map/Map','layers/DomLayer'], function(Map, DomLayer){
    var Player = function(config){
        var defaults = {
            controller:Player.controllers.local,
            killedUnits:[],        
            casualties:[],
            units:[]
        }
        merge(this,config);
        mergeUndefined(this,defaults);         
        if (this.game) {
            this.connectToGame(this.game);
        }        
    }


    Player.colors = ['red','blue','green','orange','yellow','pink','gray'];
    Player.controllers = {
        local:{type:'local'},
        remote:{type:'remote'}
    }    



    Player.prototype = {                       

        getMarker:function(){
            var cellSize = this.game.map.cellSize;
            var layerConfig = {
                tag:'div',
                size:[4,3],
                offset:[cellSize[0]/2-10,-cellSize[1]/2+10],
                css:{
                    backgroundColor:this.color,
                    // @todo MAP dosesn't loads. see: console.log('Map:',Map)
                    zIndex:100,
                    position:'absolute'

                }
            }
            return new DomLayer(layerConfig);
        },
        markUnit:function(unit){            
            //@todo probably unit.layer dont loaded yet
            this.getMarker().setParent(unit.layer).update();
        },
        /**
        * @return true if player is enemy
        */
        isEnemy:function(player) {
            return  !(this.team == player.team);
        },
        /**
        * @param Game 
        */
        connectToGame:function(game){
            this.game = game;
            var l = game.players.length;
            this.id = (l>0)?(game.players[l-1].id + 1):1;            
            if (!this.name) {
                this.name = 'Player '+this.id;
            }
            if (!this.color) {
                this.color = Player.colors[this.id-1];
            }
            // To detect that player is enemy you must compare player teams                        
            if (!this.team) {
                this.team = this.id;
            }
            if (game.players.indexOf(this)==-1) game.players.push(this);            
        }
    }

    return Player;

});
