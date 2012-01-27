/**
* MapObject class
*/
define(['layers/DomLayer'], function(DomLayer){

    var defaults = {
        layer:{},
        description: 'No info',
    }

    var MapObject = function(config){
        var self = this;
        if (config) merge(this,config);
        mergeUndefined(this,defaults);
        (this.layer instanceof DomLayer) || (this.layer = new DomLayer(this.layer));                     
        this.layer.$el.bind('click',function(){            
            self.select(self.map.game.currentPlayer);                        
        });
        this.layer.$el.bind('mouseover',function(){                        
            self.map.selectCell(self.mapCell);
        });   
    }   

    MapObject.prototype = {
        placeTo:function(map,x,y) {
            this.map = map;
            this.mapCell = map.cells[x][y];            
            this.layer
                .setParent(map.layer)
                .setOffset(this.mapCell.layer.offset)
                .update(); 
            map.objects.push(this);               
            return this;    
        },
        select:function(){
            
        } ,
        
        getInfo:function(){
            return this.description;
        }

    }
    
    return MapObject;

});