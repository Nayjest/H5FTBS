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

        this.layer.$el.bind('mouseover',function(e){
            self.map.selectCell(self);            
        });   
    }   

    MapCell.types = mapCellTypes;
    MapCell.descriptions = [];
    MapCell.descriptions[MapCell.types.plane] = 'Равнина';

    MapCell.prototype = {
        placeTo:function(map,x,y) {
            this.map = map;
            this.x = x;
            this.y = y;
            this._setupLayer();            
            map.cells[x][y]=this;    
            return this;    
        },
        nearby:function(){
            var self = this;
            var near = [];
            function add(dx,dy) {
                var x =self.x+dx;
                var y = self.y+dy;
                if (self.map.cells[x] && self.map.cells[x][y] instanceof MapCell) {
                    near.push(self.map.cells[x][y]);
                }
            }
            add(1,0);
            add(-1,0);
            add(0,1);
            add(0,-1); 
            return near;           
        },

        distanceTo:function(cell){
            if (cell==this) return 0;
            var selected = [this];
            var cellsByDist = [[this]];            
            var nearCells;
            var dist = 0;
            var added = 0;
            function notSelected(mapCell){
                for (var i in selected) {
                    if (selected[i]==mapCell) return false;
                }
                return true;
            }
            do {
                dist++;
                cellsByDist[dist]=[]; 
                added = 0;
                for (var i in cellsByDist[dist-1]) {
                    nearCells = cellsByDist[dist-1][i].nearby();                    
                    for (var j in nearCells) {          
                        if (nearCells[j]==cell) return dist;              
                        if (notSelected(nearCells[j])) {                            
                            selected.push(nearCells[j]);
                            cellsByDist[dist].push(nearCells[j]);
                            added++;
                        }
                    }
                }
            } while(added);
        },

        selectByDistance:function(distance,selected){            
            if (!selected) selected = [];
            if (distance==0) return selected;

            function notSelected(mapCell){
                for (var i in selected) {
                    if (selected[i]==mapCell) return false;
                }
                return true;
            }
            var nearCells = this.nearby();
            for (var i in nearCells) {
                if (notSelected(nearCells[i])){
                    selected.push(nearCells[i]);
                    nearCells[i].selectByDistance(distance-1,selected);
                }

            }
            return selected;

        },

        _setupLayer:function(){            
            this.layer
            .setParent(this.map.layer)                
            //.setSize(this.map.cellSize);
            this._setupLayerOffset();    
            return this;                                    
        },
        _setupLayerOffset:function(){
            this.layer.setOffset([
            (this.x-this.map.size[0]/2)*this.map.cellSize[0],
            (this.y-this.map.size[1]/2)*this.map.cellSize[1]
            ]);
        },
        select:function(){
            this.map.selectCell(this);
        },
        getInfo:function(){
            return '['+this.x+','+this.y+']<br> '+MapCell.descriptions[this.type];
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