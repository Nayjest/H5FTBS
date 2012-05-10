define(['map/MapObject', 'layers/ImageLayer', 'layers/NonDomLayer', 'Canvas'], function (MapObject, ImageLayer, NonDomLayer, Canvas) {
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
        if (options.player) delete(options.player);
        mergeUndefined(options, defaults);
        Unit.superClass.call(this, options);
        config.player && this.setPlayer(config.player);
    }
    Unit.inheritsFrom(MapObject).extendProto({
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
                for (var i in this.player.units) {
                    if (this.player.units[i] == this) {
                        delete this.player.units[i];
                        break;
                    }
                }
            }
            if (typeof(player) == 'number') {
                player = this.map.game.getPlayerById(player)
            }
            this.player = player;
            if (!player) return this;
            player.units.push(this);

            var self = this;
            this.onLoad(function () {
                player.markUnit(self);
            });

            return this;
        }


    });

    return Unit;

});