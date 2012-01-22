(function(){

    var defaults = {        
        player:null,
    }
    
    Unit = function(config){
        var options = merge({},config);
        mergeUndefined(options, defaults);        
        Unit.superClass.call(this,options);        
        this.setPlayer(options.player);
    }.inheritsFrom('MapObject').extendProto({
        select:function(player){            
            Unit.superProto.select.call(this);
            this.map.game.selectedUnit == this;            
            if (this.player == player) {                
                this.showActions();
            }
        },
        showActions:function(){
            
        },
        moveTo:function(cell){
            this.mapCell = cell;
            this.layer.setOffset(cell.layer.offset);
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
            if (!player) return this;
            this.player = player;
            player.units.push(this);
            player.markUnit(this);
            return this;
        }


    });    

})();