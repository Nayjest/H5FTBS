(function(){



    var defaults = {
        size:[10,10],
        cellSize:[74,64],
        selectedCellHoverLayer:{
            tag:'img',
            attr:{
                src:'/img/cursor/gex.png'
            },
            css:{
                zIndex:9999999,
                display:'none'
            }
        },
        $infoPanel:'#sidebar',        
    }

    Map = function(config){
        mergeUndefined(config, defaults);        
        this.size = config.size;
        this.cellSize = config.cellSize;        
        this._createLayer();
        this._clearCells();
        
        //MapCell selected at current moment 
        this.selectedCell = null,        
        
        this.selectedCellHoverLayer = new DomLayer(config.selectedCellHoverLayer);
        this.selectedCellHoverLayer.setSize(this.cellSize).setParent(this.layer);
        this.$infoPanel = $(config.$infoPanel);
        
    }
    Map.prototype = {
        _createLayer:function(){
            this.layer = new DOMLayer({
                size:[this.size[0]*this.cellSize[0], this.size[1]*this.cellSize[1]],
                css:{
                    marginTop:this.size[1]*this.cellSize[1]+105,
                }
            });   
        },
        _clearCells:function(){
            this.cells = [];        
            for (var x=0; x<this.size[0]; x++) {
                this.cells[x] = [];
                for (var y=0; y<this.size[0]; y++) {
                    this.cells[x][y] = null;
                }   
            }

        },
        selectCell:function(cell){
           this.selectedCellHoverLayer.setOffset(cell.layer.offset).show();
           this.$infoPanel.html(cell.getInfo());
        }
    }

})();