define(['map/Unit', 'utils'], function (Unit, utils) {

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

    function TbsUnit(config) {
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
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

    }

    var Me = TbsUnit;
    Me.movementTypes = {
        swim:'swim',
        walk:'walk',
        fly:'fly'
    }
    Me.inheritsFrom(Unit);
    Me.extendProto({
        presenterClass:'presenters/TbsUnitPresenter',
        onNewTurn:function () {
            this.moves = this.maxMoves;
            this.canAttackOnThisTurn = true;
            if (this.hp < this.maxHp) {
                this.hp += this.regenerationSpeed;
                if (this.hp > this.maxHp) this.hp = this.maxHp;
            }

        },
        isEnemy:function (unit) {
            return this.player.isEnemy(unit.player);
        },
        moveTo:function (cell) {
            this.moves -= this.mapCell.distanceTo(cell);
            this.mapCell = cell;
            return this;
        },
        attack:function (enemyUnit) {
            var damage = utils.rndInt(this.damage);
            enemyUnit.hp -= damage;
            if (enemyUnit.hp <= 0) {
                this.kill(enemyUnit);
            }
            this.moves = 0;
            this.canAttackOnThisTurn = false;
            console.log(this, 'attacked', enemyUnit, 'damage:', damage, 'hp:', enemyUnit.hp);
        },

        /**
         * @return array of all cells that can be attacked by unit on this turn, including unit movements
         */
        getCellsCanAttack:function () {
            if (!this.canAttackOnThisTurn) return [];
            return this.mapCell.selectByDistance(this.moves + 1, []);
        },
        /**
         * Get cells that contains enemy units can be attacked by this unit
         */
        getAttackTargetCells:function () {
            var targets = [];
            var cellsCanAttack = this.getCellsCanAttack();
            for (var i = cellsCanAttack.length, cell, units; i--;) {
                cell = cellsCanAttack[i];
                units = cell.getUnits();
                for (var j = units.length; j--;) {
                    if (units[j].isEnemy(this)) {
                        targets.push(cell);
                        break;
                    }
                }
            }
            return targets;
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
        destroy:function () {
            if (this.map && this.map.units) {
                utils.removeFromArray(this, this.map.units);
            }
            Me.superProto.destroy.call(this);
        },
        canMoveTo:function (cell) {
            return this.getCellsCanMove().indexOf(cell) != -1;
        },
        isMyTurn:function () {
            return this.player == this.map.game.currentPlayer;
        }

    });

    return TbsUnit;

});
