(function(){


    Gex = function(config){
        Gex.superClass.apply(this,arguments);
    }
    Gex.inheritsFrom('MapCell').extendProto({
        
        _setupLayerOffset:function(){
            var x = this.x;
            var y = this.y;
            var map = this.map;
            this.layer.setOffset([
                (x*0.991-map.size[0]/2)*map.cellSize[0]*3/4,
                (y*0.991-map.size[1]/2 + ((x % 2 == 0) ? 0.5 : 0))*map.cellSize[1]
            ]);
        },
        
        /**
        *  @todo rename to getNeighboringCells
        *  @return array of neighboring cells
        */
        nearby:function(){
            var self = this;
            var near = [];
            function add(dx,dy) {
                var x = self.x+dx;
                var y = self.y+dy;
                if (self.map.cells[x] && self.map.cells[x][y] instanceof MapCell) {
                    near.push(self.map.cells[x][y]);
                }
            }
            add(1,0);
            add(-1,0);
            add(0,1);
            add(0,-1); 
            
            add(1,(this.x % 2 == 0)?1:-1);
            add(-1,(this.x % 2 == 0)?1:-1);
            
            return near;           
        },

    });   


    Gex.generators = {
        grass:function()
        {
            return {
                _class:'Gex',
                type: MapCell.types.plane,
                layer: {                    
                    attr: {                        
                        'class':'noselect'
                    },
                    css: {
                        backgroundImage:'url(/img/terrain/grass1/grass1_r'+rndInt(1,6)+'.png)',
                        backgroundSize:'cover',
                        '-webkit-background-size':'cover',
                        backgroundPosition:'center',

                        position:'absolute',
                        zIndex:rndInt(Map.zLevels.ground),
                    },
                    size:[105,105]
                }
            }; 
        },
        test:function()
        {
            return {
                _class:'Gex',
                type: MapCell.types.plane,
                layer: {
                    tag:'img',  
                    attr: {
                        src: '/img/terrain/gex/test.png',
                        'class':'noselect'
                    },
                    css:{
                        position:'absolute',
                        overflow:'visible'
                    },
                    size:[74,64]
                }
            }; 
        }
    }


})();    