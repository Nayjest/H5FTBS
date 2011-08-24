(function(){


   Gex = function(config){
        Gex.superClass.apply(this,arguments);
   }.inheritsFrom('MapCell').extendProto({
        placeTo:function(map,x,y) {
            this.map = map;
            this.layer
                .setParent(map.layer)
                .setOffset([
                    (x*0.991-map.size[0]/2)*map.cellSize[0]*3/4,
                    (y*0.991-map.size[1]/2 + ((x % 2 == 0) ? 0.5 : 0))*map.cellSize[1]
                ])
                //.setSize(map.cellSize)
                .update();
            map.cells[x][y]=this;    
            return this;    
        },
    
   });   

   function rndInt(min, max)
   {
       return Math.floor(Math.random() * (max - min + 1)) + min;
   }


   Gex.generators = {
        grass:function()
        {
            return {
                _class:'Gex',
                type: MapCell.types.plane,
                layer: {
                    tag:'img',  
                    attr: {
                        src: '/img/terrain/grass1/grass1_r'+rndInt(1,6)+'.png',
                        'class':'noselect'
                    },
                    css:{
                        position:'absolute',
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
                    },
                    size:[74,64]
                }
            }; 
        }
   }

    
})();    