(function(){

    var defaults = {        
        maxMoves:2,
        moves:2,
        maxHp:10,
        hp:10,        
        regenerationSpeed:1,
    }

    TbsUnit = function(config){
        mergeUndefined(config,defaults);
        TbsUnit.superClass.call(this,config);
        this.moves = config.moves;
        
        this._guiLayers = [];
    }
    TbsUnit.inheritsFrom('Unit').extendProto({
        onNewTurn:function(){
            this.moves = this.maxMoves;
            
            if (this.hp<this.maxHp) {
                this.hp+=this.regenerationSpeed;
                if (this.hp>this.maxHp) this.hp = this.maxHp;
            }
            
        },
        placeTo:function(map,x,y) {
            TbsUnit.superProto.placeTo.call(this,map,x,y);
            map.units.push(this);
            return this;
        },
        moveTo:function(cell){
                        
            this.moves -= this.mapCell.distanceTo(cell);            
            TbsUnit.superProto.moveTo.call(this,cell);
            if (this.map.game.currentPlayer = this.player) {
                this.showActions();    
            }            
            return this;
        },        
        showActions:function(){
            TbsUnit.superProto.showActions.call(this);
            this._highlightMoves();
            return this;
        },         
        _clearMovesHighlight:function(){
            
            for (var i in TbsUnit._movementHighlightLayers) {
                TbsUnit._movementHighlightLayers[i].destroy();
            }
            TbsUnit._movementHighlightLayers= [];
        },         
        //Highlight map cells that can be reached by this unit in current turn
        _highlightMoves:function(){
            var self = this;
            this._clearMovesHighlight();
            if  (this.moves<=0) return;
            var selected = this.mapCell.selectByDistance(this.moves,[this.mapCell]);   
            
            //exclude current cell
            selected.shift();         
            var l;
            for (var i in selected) {
                var cell = selected[i];
                l = new DomLayer({
                    tag:'img',
                    
                    attr:{
                        'class':'noselect',
                        src:'/img/cursor/gex_green.png'
                    },
                    offset:cell.layer.offset,
                    size:this.map.cellSize,
                    css:{
                        zIndex:Map.zLevels.mapCellHighlight+1,
                        position:'absolute',
                    },
                    parent:this.map.layer,
                }).update();
                (function(cell){
                l.$el.bind({
                    click:function(){                        
                        self.moveTo(cell);                                        
                    },
                    mouseover:function(){
                        cell.select();                                            
                    }
                });
                })(cell);
                TbsUnit._movementHighlightLayers.push(l);
            }
            

        }
    });    
    TbsUnit._movementHighlightLayers = [];

})();