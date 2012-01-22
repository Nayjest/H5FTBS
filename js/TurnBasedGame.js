(function(){

    var defaults = {
        $currentPlayer:'#playerInfo',        
    }
    
    TurnBasedGame = function(config){        
        mergeUndefined(config, defaults);        
        if (config.$currentPlayer) {
            this.$currentPlayer = $(config.$currentPlayer);
        }
        this.turn = 0;
        TurnBasedGame.superClass.call(this,config);                   
        
    }.inheritsFrom('Game').extendProto({
        addPlayer:function(player){
            TurnBasedGame.superProto.addPlayer.call(this,player);
            if (!this.currentPlayer) {
                this.newTurn();
            }
        },
        nextTurn:function(){

            var i;
            for (i in this.players){
                if (this.players[i]==this.currentPlayer) break;
            }
            if (i==this.players.length-1) {
                this.newTurn();
            } else {
                i++;
                this.setCurrentPlayer(this.players[i]);
            }

        },
        nextUnit:function(){
            var player = this.currentPlayer;
            var unit = this.selectedUnit;
            if (!unit || (unit.player != player)) {
                unit = player.units[0];                
            } else {
                for (var i in player.units) {
                    if (player.units[i] == unit) {
                        unit = player.units[parseInt(i)+1];
                        //console.log(i+1);
                        if (!unit) {
                            unit = player.units[0];                
                        }
                        break;
                    }                    
                }
                
            }
            
            unit.select(player);
            this.selectedUnit = unit;

        },
        newTurn:function(){
            this.turn++;
            var units = this.map.units;
            for (var i in units) {
                units[i].onNewTurn();
            }
            this.setCurrentPlayer(this.players[0]);
            console.log('turn '+this.turn);
            
        },
        setCurrentPlayer:function(player){
            this.currentPlayer = player;
            this.$currentPlayer.html(player.name);
            if (player.units.length>0) {
                player.units[0].select(player);
            }
              
        }
    });    

})();