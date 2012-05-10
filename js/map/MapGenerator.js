define(['map/Map'], function(Map){

    /**
    * @param Map|mapConfig|null map
    */
    MapGenerator = function(map){
        if (map) this.create(map);
    }
    MapGenerator.prototype = {
        create:function(mapConfig) {
            this.map = new Map(mapConfig);
            return this;
        },
        fill:function(config) {            
            var map = this.map;
            var conf;
            map.cells = [];                    
            for (var x=0; x<map.size[0]; x++) {
                map.cells[x] = [];
                for (var y=0; y<map.size[1]; y++) {
                    conf = (config instanceof Function)?config():config; 
                    merge(conf,{map:map,x:x,y:y});
                    construct(conf);
                }   
            }
            return this;
        }

    }
    MapGenerator.create=function(mapOrConfig){
        return new MapGenerator(mapOrConfig);
    }
    
    return MapGenerator;

});
