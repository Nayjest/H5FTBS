(function(){


    var mapCellTypes = {
        road:0,
        plane:{
            id:1,
            name:'Равнина',
            description:'Обычная равнина, ничего особенного'
            
        },
        mountain:2,
        sand:3,
        swamp:4,
        wood:5,
        water:6,
        deepWater:7,
        ice:8,
        lava:9,
        wall:10,

    }

    var defaults = {
        type: mapCellTypes.plane,
        layer:{},
    }

    MapCell = function(config){
        var self = this;
        if (config) merge(this,config);
        mergeUndefined(this,defaults);
        (this.layer instanceof DomLayer) || (this.layer = new DomLayer(this.layer));     
        this.layer.highlight = new Highlight(this.layer,{});
        
        this.layer.$el.click(function(){
            self.map.selectCell(self);
        });   
    }   

    MapCell.types = mapCellTypes;
    MapCell.descriptions = [];
    MapCell.descriptions[MapCell.types.plane] = 'Равнина';

    MapCell.prototype = {
        placeTo:function(map,x,y) {
            this.map = map;
            this.layer
                .setParent(map.layer)
                .setOffset([
                    (x-map.size[0]/2)*map.cellSize[0],
                    (y-map.size[1]/2)*map.cellSize[1]
                ])
                .setSize(map.cellSize)
                .update();
            map.cells[x][y]=this;    
            return this;    
        },
        
        getInfo:function(){
            return MapCell.descriptions[this.type];
        }

    }

    MapCell.generators = {
        grass:function()
        {
            return {
                _class:'MapCell',
                type: MapCell.types.plane,
                layer: {
                    tag:'img',  
                    attr: {
                        src: '/img/terrain/grass1/grass1_r1.png'
                    },
                    css:{
                        position:'absolute',
                    }
                }
            }; 
        }
    }


})();