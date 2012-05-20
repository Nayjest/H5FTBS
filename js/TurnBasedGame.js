define(['Game','Class'],function(Game, OOP){

    
    TurnBasedGame = function(config){
        this.turn = 0;
        TurnBasedGame.superClass.call(this,config);
    }
    TurnBasedGame.inheritsFrom(Game).extendProto({
        addPlayer:function(player){
            TurnBasedGame.superProto.addPlayer.call(this,player);
            if (!this.currentPlayer) {
                this.newTurn();
            }
        },
        nextTurn:function(){
            var i;
            for (i = this.players.length;i>0;i--){
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
            var unit = this.currentUnit;
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
            this.setCurrentUnit(unit);
        },
        newTurn:function(){
            this.turn++;
            var units = this.map.units;
            for (var i = units.length; i--;) {
                units[i].onNewTurn();
            }
            this.setCurrentPlayer(this.players[0]);
        },
        setCurrentPlayer:function(player){
            this.currentPlayer = player;
            //this.$currentPlayer.html(player.name);
            this.nextUnit();
            if (player.units.length) {
                //player.units[0].select();
            }
              
        },
        setCurrentUnit:function(unit){
            this.currentUnit = unit;
        }
    });  
    
    return TurnBasedGame;
});
