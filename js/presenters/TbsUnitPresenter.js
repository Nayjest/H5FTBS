define(['presenters/UnitPresenter', 'AnimationManager'], function (UnitPresenter, AnimationManager) {

    var _animationManager = AnimationManager.getInstance();

    function TbsUnitPresenter(model, mapPresenter) {
        Me.superClass.call(this, model, mapPresenter);
    }

    var Me = TbsUnitPresenter.inheritsFrom(UnitPresenter);
    Me.extendProto({
        _onLayerLoaded:function (layer) {
            Me.superProto._onLayerLoaded.call(this, layer);

            this.model.on('moveTo', function (cell) {
                this.hideActions();
                _animationManager.move(this.layer, cell.presenter.layer.offset, 1).done(function () {
                    this.showActions();
                }.bind(this));
            }.bind(this));
        },
        showActions:function () {
            Me.superProto.showActions.call(this);
            this._highlightMoves();
            this._highlightAttackTargets();
            return this;
        },
        hideActions:function () {
            Me.superProto.hideActions.call(this);
            this._clearMovesHighlight();
            this._clearAttackTargetsHighlight();
        },
        deselect:function () {
            this.hideActions();
            Me.superProto.deselect.call(this);
        },
        _clearMovesHighlight:function () {

            for (var i = Me._movementHighlights.length; i--;) {
                Me._movementHighlights[i].destroy();
            }
            Me._movementHighlights = [];
            //this.mapPresenter.layer.update();
        },
        _clearAttackTargetsHighlight:function () {
            for (var i = Me._attackTargetHighlights.length; i--;) {
                Me._attackTargetHighlights[i].destroy();
            }
            Me._attackTargetHighlights = [];
            //this.mapPresenter.layer.update();
        },
        //Highlight map cells that can be reached by this unit in current turn
        _highlightMoves:function () {
            this._clearMovesHighlight();
            var cellsCanMove = this.model.getCellsCanMove(true);
            for (var i = cellsCanMove.length, hl; i--;) {
                hl = cellsCanMove[i].presenter.createHighlightLayer('green');
                // move current unit to highlight
                hl.ready.done(function (hl) {
                    hl.layer.on('click', function (e) {
                        hl.cell.map.game.currentUnit.moveTo(hl.cell);
                        hl.layer.stopEvent();
                    });
                });

                Me._movementHighlights.push(hl);
            }
        },
        _highlightAttackTargets:function () {
            this._clearAttackTargetsHighlight();
            var attackTargetCells = this.model.getAttackTargetCells();
            for (var i = attackTargetCells.length, hl; i--;) {
                hl = attackTargetCells[i].presenter.createHighlightLayer('red');
                hl.layer.on('mouseover', function (e) {
                    var currentUnit = hl.cell.map.game.currentUnit;
                    var attackFromCell = hl.cell.presenter.getClosestNeighborByCursor(currentUnit.getCellsCanMove());
                    if (attackFromCell) {
                        currentUnit.presenter.mapPresenter.focusOnCell(attackFromCell);
                        hl.layer.stopEvent();
                    }
                });
                hl.layer.on('click', function (e) {
                    var currentUnit = hl.cell.map.game.currentUnit;
                    var attackCell = currentUnit.presenter.mapPresenter.focusedCell;
                    if (!attackCell) return;
                    currentUnit.moveTo(attackCell);
                    currentUnit.attack(hl.cell.getUnits()[0]);
                    hl.layer.stopEvent();


                });
                Me._attackTargetHighlights.push(hl);
            }
        }


    });
    Me._movementHighlights = [];
    Me._attackTargetHighlights = [];
    return TbsUnitPresenter;
});
