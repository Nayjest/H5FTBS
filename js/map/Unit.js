define(['map/MapObject', 'layers/ImageLayer', 'layers/NonDomLayer', 'Canvas', 'utils', 'Player'], function (MapObject, ImageLayer, NonDomLayer, Canvas, utils, Player) {
    //"use strict";
    /* Get global object (window in browser) in strict mode */
    var FN = Function,
        glob = FN('return this')(),
        /* Get settings from global object */
        settings = glob.settings = glob.settings ? glob.settings : {};

    var defaults = {
        player:null,
        type:'Default unit',
        killedUnits:[]
    };

    var _canvas;
    if (settings.graphicsEngine !== 'dom') {
        //@todo try to move require('Canvas'),etc. here
        _canvas = Canvas.getByName('units', {
            zIndex:1
        });
    }


    Unit = function (config) {
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Unit.superClass.call(this, options);
        //config.player && this.setPlayer(config.player);
    };
    var Me = Unit;
    Me.inheritsFrom(MapObject).extendProto({
        select:function () {
            Unit.superProto.select.call(this);
            var player = this.map.game.currentPlayer;
            this.map.game.selectedUnit = this;
            if (this.player == player) {
                this.showActions();
            }
        },
        _initLayer:function () {

            var self = this;
            ImageLayer.load(this.layer, function (layer) {
                if (ImageLayer.isCanvasEngine) {
                    layer.setCanvas(_canvas);
                }
                if (self.map) {
                    layer.offset[1] = ~~(layer.offset[1] - (layer.size[1] - self.map.cellSize[1]) / 2 - self.map.cellSize[1] / 4);
                }
                self.layer = new NonDomLayer({
                    canvas:_canvas,
                    size:layer.size
                });
                self.layer.addChild(layer);
                //self.layer = layer;
                self.ready = true;
                layer.on('click', function () {
                    self.select(self.map.game.currentPlayer);
                });
                layer.on('mouseover', function () {
                    console.log('works1');
                    self.map.selectCell(self.mapCell);
                });
                self._doOnLoad();
            });
        },
        deselect:function () {
            this.map.game.selectedUnit = null;
            //@todo hideActions
        },
        kill:function (enemyUnit) {
            this.killedUnits.push(enemyUnit);
            this.player.killedUnits.push(enemyUnit);
            enemyUnit.die();
        },
        placeTo:function (map, x, y) {
            Me.superProto.placeTo.call(this, map, x, y);
            map.units.push(this);
            return this;
        },
        die:function () {
            this.player.casualties.push(this);
            this.setPlayer(null);
            this.destroy();

        },
        showActions:function () {
            // @todo
        },
        moveTo:function (cell) {
            this.mapCell = cell;
            this.map.game.animationManager.move(this.layer, cell.layer.offset, 1);
            //this.layer.setOffset(cell.layer.offset);            
        },

        /**
         * @param Player player
         */
        setPlayer:function (player) {
            if (this.player) {
                utils.removeFromArray(this, player.units);
            }
            this.player = player;
            if (player instanceof Player) {
                player.units.push(this);
                this.onLoad(function () {
                    player.markUnit(this);
                }.bind(this));
            }
            return this;
        }


    });

    return Unit;

});