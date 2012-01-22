(function(){


    Player = function(config){        
        merge(this,config); 
        this.units = [];       
        if (this.game) {
            this.connectToGame(this.game);
        }
        if (!this.controller) {
            this.controller = Player.controllers.local;
        }
    }
        

    Player.prototype = {        
        getMarker:function(){
            var cellSize = this.game.map.cellSize;
            console.log('cs',cellSize);
            var layerConfig = {
                tag:'div',
                size:[4,3],
                offset:[cellSize[0]/2-10,-cellSize[1]/2+10],
                css:{
                    backgroundColor:this.color,
                    zIndex:Map.zLevels.gui,                    
                    position:'absolute',
                    
                }
            }
            return new DomLayer(layerConfig);
        },
        markUnit:function(unit){            
            this.getMarker().setParent(unit.layer).update();
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
            if (!this.team) {
                this.team = this.id;
            }
            game.addPlayer(this);            
        }        
    }

    Player.colors = ['red','blue','green','orange','yellow','pink','gray'];
    Player.controllers = {
        local:{type:'local'},
        remote:{type:'remote'},
    }    

})();