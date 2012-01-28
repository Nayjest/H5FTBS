define(['map/MapObject'], function(MapObject){

    var defaults = {        
        player:null,
        type: 'Default unit',
        killedUnits:[],
    }
    
    Unit = function(config){
        var options = merge({},config);
        if (options.player) delete(options.player);
        mergeUndefined(options, defaults);        
        Unit.superClass.call(this,options);        
        config.player && this.setPlayer(config.player);
    }
    Unit.inheritsFrom(MapObject).extendProto({
        select:function(){                        
            Unit.superProto.select.call(this);
            var player = this.map.game.currentPlayer; 
            this.map.game.selectedUnit = this;            
            if (this.player == player) {                
                this.showActions();
            }
        },
        deselect:function(){
            this.map.game.selectedUnit = null;
            //@todo hideActions
        },
        kill:function(enemyUnit){
            this.killedUnits.push(enemyUnit);
            this.player.killedUnits.push(enemyUnit);                        
            enemyUnit.die();
        },
        die:function(){
            this.player.casualties.push(this);
            this.setPlayer(null);
            this.destroy();
            
        },
        showActions:function(){
               // @todo
        },
        moveTo:function(cell){            
            this.mapCell = cell;
            this.map.game.animationManager.move(this.layer,cell.layer.offset,1);
            //this.layer.setOffset(cell.layer.offset);            
        },
        /**
        * @param Player player
        */
        setPlayer:function(player){           
            if (this.player) {
                for (var i in this.player.units) {
                    if (this.player.units[i]==this) {
                        delete this.player.units[i];
                        break;
                    }    
                }
            }
            if (typeof(player) == 'number') {
                player = this.map.game.getPlayerById(player)
            }
            this.player = player;
            if (!player) return this;            
            player.units.push(this);
            
            var self = this;
            this.onLoad(function(){
                player.markUnit(self);    
            });
            
            return this;
        }


    });    
    
    return Unit;

});