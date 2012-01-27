define(['map/Map','AnimationManager', 'Class'],function(Map, AnimationManager, Class){
    
    var defaults = {    
        map:null
    }
    
    Game = function(config){
        mergeUndefined(config, defaults);
        
        this.map = config.map instanceof Map? config.map : Map.load(config.map);
        this.animationManager = new AnimationManager();
        map.game = this;
        this.players = [];
        if (config.players) {            
            for (var i in config.players) {
                config.players[i].connectToGame(this);
            }
        }
        //this.currentPlayer = this.players[0].id;
    }
    
    Game.prototype = {
        addPlayer:function(player){
            this.players.push(player);            
        }
        
    }
    
    return Game;

});