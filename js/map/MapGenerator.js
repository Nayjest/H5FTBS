define(['map/Map'], function(Map){

    /**
    * @param Map|mapConfig|null map
    */
    MapGenerator = function(){
        if (arguments.length>0){
            if (arguments[0] instanceof Map) {
                this.map = arguments[0];
            }else{
                this.create(arguments[0]);
            }
        }   
        console.log('MapGenerator created:');
        console.log(this);     
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