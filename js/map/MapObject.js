/**
* MapObject class
*/
define(['layers/ImageLayer', 'Loadable'], function(ImageLayer){

    var defaults = {
        layer:null,
        description: 'No info',

        /**
         * @var bool|string|array
         * true: can pass any case
         * false: can't pass any case
         * MapCell.movementTypes.fly -- fly only (add limitations for all other)
         * [MapCell.movementTypes.fly, MapCell.movementTypes.walk] (add limitations for all other, no swim in this case)
         *
         */
        passable: false
    }

    /**
     *
     * @param config
     */
    var MapObject = function(config){
        var self = this;
        this._onLoad = [];
        if (config) merge(this,config);
        mergeUndefined(this,defaults);

        ImageLayer.load(this.layer,function(layer){

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