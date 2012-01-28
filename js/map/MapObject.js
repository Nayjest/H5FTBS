/**
* MapObject class
*/
define(['layers/DomLayer', 'Loadable'], function(DomLayer){

    var defaults = {
        layer:{},
        description: 'No info',
    }

    var MapObject = function(config){
        var self = this;   
        this._onLoad = [];
        if (config) merge(this,config);
        mergeUndefined(this,defaults);  
        DomLayer.load(this.layer,function(layer){            
            
            layer.on('click',function(){            
               self.select(self.map.game.currentPlayer);                        
            });
            layer.on('mouseover',function(){                        
               self.map.selectCell(self.mapCell);
            });   
            self.layer = layer;
            self.ready = true;            
            for(var i in self._onLoad) {                
                self._onLoad[i](self);                
            }
            
        });        
        
    }   

    MapObject.prototype = {
        placeTo:function(map,x,y) {
            var self = this;
            this.map = map;
            this.mapCell = map.cells[x][y];            
            this.mapCell.onLoad(function(cell){self.onLoad(function(){
                console.log('layer loaded',self.layer);
                self.layer
                    .setParent(map.layer)
                    .setOffset(cell.layer.offset)
                    .update(); 
            })});                        
            map.objects.push(this);               
            return this;    
        },      
        onLoad:function(callback){
            if (!this.ready)
                this._onLoad.push(callback);
            else
                callback(this);    
        },
        destroy:function(){
          for (var i in this.map.objects) {
              if (this.map.objects[i] == this) {
                  delete(this.map.objects[i]);
              }
          } 
          this.layer.destroy();
        },
        select:function(){
            
        },
        
        getInfo:function(){
            return this.description;
        }

    }
    
    return MapObject;

});