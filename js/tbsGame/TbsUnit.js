define(['map/Unit', 'Utils'], function (Unit, Utils) {

    var defaults = {
        maxMoves:2,
        moves:undefined,

        maxHp:10,
        hp:10,
        damage:[3, 5],
        // quantity of hp that regenerates at each turn
        regenerationSpeed:1,
        race:'Default race',
        canAttackOnThisTurn:true,
        movementTypes:null
    }

    TbsUnit = function (config) {
        var self = this;
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        TbsUnit.superClass.call(this, options);
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
        this.onLoad(function () {
            //attack if enemy
            self.layer.on('click', function () {
                /** @var Attacker unit */
                var u = self.map.game.selectedUnit;
                if (u && u.isMyTurn() && u.canAttack(self) && u.canMoveTo(self.map.selectedCell)) {
                    u.moveTo(self.map.selectedCell).attack(self);
                }
            });

            // @todo Don't works!!
            //show direction of attack
            var handler = function () {
                /** @var TbsUnit u Attacker unit */
                var u = self.map.game.selectedUnit;
                if (u && u.isMyTurn() && u.canAttack(self)) {
                    var attackFromCell = self.mapCell.getClosestNeighborByCursor(u.getCellsCanMove());
                    if (attackFromCell) {
                        attackFromCell.select();
                    } else {
                        console.log('attackFromCell is empty, errors in business logic!');
                    }
                }
            }
            self.layer.on('mouseover', handler);

        });
    }
    var Me = TbsUnit;
    Me.movementTypes = {
        swim:'swim',
        walk:'walk',
        fly:'fly'
    }
    Me.inheritsFrom(Unit).extendProto({
        onNewTurn:function () {
            this.moves = this.maxMoves;
            this.canAttackOnThisTurn = true;
            if (this.hp < this.maxHp) {
                this.hp += this.regenerationSpeed;
                if (this.hp > this.maxHp) this.hp = this.maxHp;
            }

        },
        placeTo:function (map, x, y) {
            Me.superProto.placeTo.call(this, map, x, y);
            map.units.push(this);
            return this;
        },
        isEnemy:function (unit) {
            return this.player.isEnemy(unit.player);
        },
        moveTo:function (cell) {

            this.moves -= this.mapCell.distanceTo(cell);
            Me.superProto.moveTo.call(this, cell);
            if (this.map.game.currentPlayer = this.player) {
                this.showActions();
            }
            return this;
        },
        attack:function (enemyUnit) {
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
        getCellsCanAttack:function () {
            if (!this.canAttackOnThisTurn) return [];
            return this.mapCell.selectByDistance(this.moves + 1, []);
        },
        getCellsCanMove:function (includeCurrentCell) {
            var self = this;

            //find cells that can be reached ignoring obstacles
            var cells = this.mapCell.selectByDistance(this.moves);
            if (!includeCurrentCell) {
                //@todo Error!!!! Not current cell shifting!!
                cells.shift();
            }

            // + detect not passable map objects excepting friend units, that can be crossed
            var canNotCross = cells.filter(function (cell) {
                var obj = cell.getObjects().filter(function (obj) {
                    if (obj instanceof Unit) {
                        return self.isEnemy(obj);
                    }
                    return !obj.passable;
                });
                return obj.length;
            });
            //find cells that can be reached considering obstacles
            cells = this.mapCell.selectByDistance(this.moves, [], canNotCross);

            // remove cells on which unit can't end his turn because there are other units located                                     
            return cells.filter(function (cell) {
                var units = cell.getUnits();
                if (!units.length) return true;
                if (units.pop() === self) return true;
            });
        },
        canAttack:function (unit) {
            return this.isEnemy(unit) && this.getCellsCanAttack().indexOf(unit.mapCell) != -1;
        },
        destroy:function() {
            if (this.map) {
                for (var i = this.map.units.length;i--;){
                    if (this.map.units[i]==this) {
                        this.map.units.splice(i,1);
                    }
                }
            }
            Me.superProto.destroy.call(this);
        },
        canMoveTo:function (cell) {
            return this.getCellsCanMove().indexOf(cell) != -1;
        },
        isMyTurn:function () {
            return this.player == this.map.game.currentPlayer;
        },
        showActions:function () {
            TbsUnit.superProto.showActions.call(this);
            this._highlightMoves();
            return this;
        },
        select:function () {
            var selectedUnit = this.map.game.selectedUnit;
            if (selectedUnit && selectedUnit.canAttack(this)) {
                // Dont select unit when attack
                return;
            } else {
                TbsUnit.superProto.select.call(this);
            }

        },
        deselect:function () {
            this._clearMovesHighlight();
            TbsUnit.superProto.deselect.call(this);
        },
        _clearMovesHighlight:function () {

            for (var i = TbsUnit._movementHighlightLayers.length; i--;) {
                TbsUnit._movementHighlightLayers[i].destroy();
            }
            TbsUnit._movementHighlightLayers = [];
        },
        //Highlight map cells that can be reached by this unit in current turn
        _highlightMoves:function () {
            var self = this;
            this._clearMovesHighlight();
            if (this.moves <= 0) return;
            var cellsCanMove = this.getCellsCanMove(true);
            var l, cell, unit;
            for (var i = cellsCanMove.length; i--;) {
                cell = cellsCanMove[i];
                unit = cell.getUnits().pop();
                if (unit && this.isEnemy(unit)) {
                    l = cell.createHighlightLayer('red');
                } else if (!unit || unit === self) {
                    l = cell.createHighlightLayer('green');
                    (function (cell) {
                        l.on('click', function () {
                            self.moveTo(cell);
                        });
                    })(cell);
                }
                (function (cell) {
                    l.on('mouseover', function () {
                        cell.select();
                    });
                })(cell);
                TbsUnit._movementHighlightLayers.push(l);
            }


        }
    });
    TbsUnit._movementHighlightLayers = [];

    return TbsUnit;

});
