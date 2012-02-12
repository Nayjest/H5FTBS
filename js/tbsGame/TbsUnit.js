define(['map/Unit', 'Utils'], function(Unit, Utils){

    var defaults = {        
        maxMoves:2,
        moves:undefined,

        maxHp:10,
        hp:10,        
        damage:[3,5],
        // quantity of hp that regenerates at each turn
        regenerationSpeed:1,
        race: 'Default race',
        canAttackOnThisTurn:true,
        movementTypes:null
    }

    TbsUnit = function(config){
        var self = this;
        var options = merge({},config);        
        mergeUndefined(options, defaults);
        TbsUnit.superClass.call(this,options);
        //by default unit can walk only
        if (!this.movementTypes) {
            this.movementTypes = [TbsUnit.movementTypes.walk];
        }

        if (this.moves === undefined) {
            this.moves = this.maxMoves;
        }
        if (this.hp === undefined) {
            this.hp = this.maxHp;
        }                
        this._guiLayers = [];
        this.onLoad(function(){
            //attack if enemy
            self.layer.on('click', function(){                                                         
                /** @var Attacker unit */
                var u = self.map.game.selectedUnit;
                if (u && u.isMyTurn() && u.canAttack(self) && u.canMoveTo(self.map.selectedCell)) {               
                    u.moveTo(self.map.selectedCell).attack(self);                              
                }
            });
            //show directionof attack
            self.layer.on('mousemove',function(){                
                /** @var Attacker unit */
                var u = self.map.game.selectedUnit;
                if (u && u.isMyTurn() && u.canAttack(self)) {
                    var attackFromCell = self.mapCell.getClosestNeighborByCursor(u.getCellsCanMove()); 
                    if (attackFromCell) {
                        attackFromCell.select();
                    } else {
                        console.log('attackFromCell is empty, errors in business logic!');
                    }    
                }

            });    
        });
    }
    TbsUnit.movementTypes = {
                swim:'swim',
                walk:'walk',
                fly:'fly'
    }
    TbsUnit.inheritsFrom(Unit).extendProto({
        onNewTurn:function(){
            this.moves = this.maxMoves;
            this.canAttackOnThisTurn = true;
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
        isEnemy:function(unit){
            return this.player.isEnemy(unit.player);
        },
        moveTo:function(cell){

            this.moves -= this.mapCell.distanceTo(cell);            
            TbsUnit.superProto.moveTo.call(this,cell);
            if (this.map.game.currentPlayer = this.player) {
                this.showActions();    
            }            
            return this;
        },
        attack:function(enemyUnit){
            console.log(this, 'attacked', enemyUnit);

            var damage = Utils.rndInt(this.damage);
            enemyUnit.hp -= damage;            
            if (enemyUnit.hp <= 0) {
                this.kill(enemyUnit);
            }
            this.moves = 0;
            this.canAttackOnThisTurn = false;
            this._clearMovesHighlight();
        },

        /**
        * @return array of all cells that can be attacked by unit on this turn, including unit movements
        */
        getCellsCanAttack:function(){
            if (!this.canAttackOnThisTurn) return [];
            return this.mapCell.selectByDistance(this.moves + 1,[this.mapCell]);             
        },
        getCellsCanMove:function(includeCurrentCell){            
            var self = this;

            //find cells that can be reached ignoring obstacles
            var cells =  this.mapCell.selectByDistance(this.moves,[this.mapCell]);             
            if (!includeCurrentCell) {
                cells.shift();
            }
            

            // + detect not passable map objects excepting friend units, that can be crossed
            var canNotCross = cells.filter(function(cell){
                var obj = cell.getObjects().filter(function(obj){
                  return (obj instanceof Unit && self.isEnemy(obj)) || !obj.passable;
                });
                return obj.length;
            });
            //find cells that can be reached considering obstacles
            cells =  this.mapCell.selectByDistance(this.moves,[this.mapCell], canNotCross);
            
            // remove cells on which unit can't end his turn because there are other units located                                     
            return cells.filter(function(cell){return !cell.getUnits().length});
        }, 
        canAttack:function(unit){
            return this.isEnemy(unit) && this.getCellsCanAttack().indexOf(unit.mapCell) != -1;
        },
        canMoveTo:function(cell){
            return this.getCellsCanMove().indexOf(cell) != -1;
        },      
        isMyTurn:function(){
            return this.player == this.map.game.currentPlayer;
        },
        showActions:function(){
            TbsUnit.superProto.showActions.call(this);
            this._highlightMoves();
            return this;
        },                 
        select:function(){                        
            var selectedUnit = this.map.game.selectedUnit;
            if (selectedUnit && selectedUnit.canAttack(this)) {
                // Dont select unit when attack
                return;
            } else {
                TbsUnit.superProto.select.call(this);                            
            }            
            
        },  
        deselect:function(){
            this._clearMovesHighlight();
            TbsUnit.superProto.deselect.call(this);    
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
            var selected = this.getCellsCanMove();
            console.log('canmove to',selected);
            var l;
            for (var i in selected) {
                var cell = selected[i];                
                var unit;
                if (unit = cell.getUnits().pop()) {                    
                    if (this.isEnemy(unit)) {
                        l = cell.createHighlightLayer('red');  
                    }  
                }else{
                    l = cell.createHighlightLayer('green');  
                    (function(cell){  
                        l.on('click',function(){self.moveTo(cell);});  
                    })(cell);
                }                                
                (function(cell){
                    l.on('mouseover',function(){cell.select();});
                })(cell);
                TbsUnit._movementHighlightLayers.push(l);
            }


        }
    });    
    TbsUnit._movementHighlightLayers = [];

    return TbsUnit;

});