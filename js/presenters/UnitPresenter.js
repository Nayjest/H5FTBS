define(
    ['presenters/MapObjectPresenter', 'Canvas', 'layers/NonDomLayer', 'Player', 'presenters/PlayerPresenter'],
    function (MapObjectPresenter, Canvas, NonDomLayer, Player, PlayerPresenter) {
        "use strict";
        /* Get global object (window in browser) in strict mode */
        var FN = Function,
            glob = FN('return this')(),
            /* Get settings from global object */
            settings = glob.settings = glob.settings ? glob.settings : {};

        if (settings.graphicsEngine !== 'dom') {
            //@todo try to move require('Canvas'),etc. here
            var _canvas = Canvas.getByName('units', {
                zIndex:1
            });
        }


        function UnitPresenter(model, mapPresenter) {
            Me.superClass.call(this, model, mapPresenter);
        }

        var Me = UnitPresenter.inheritsFrom(MapObjectPresenter);
        Me.extendProto({
            select:function () {
                //Me.superProto.select.call(this);
                var game = this.mapPresenter.map.game;
                if (this.model.player == game.currentPlayer) {
                    this.showActions();
                }
            },
            deselect:function () {
                this.mapPresenter.map.game.currentUnit = null;
                //@todo hideActions
            },
            showActions:function () {

            },
            hideActions:function() {

            },
            _onLayerLoaded:function (layer) {
                Me.superProto._onLayerLoaded.call(this,layer);
                //var layer = this.layer;

                // set player icon to unit layer
                this.model.on('setPlayer', function (player) {
                    if (player instanceof Player && player.presenter instanceof PlayerPresenter) {
                        player.presenter.setPlayerIcon(this);
                    }
                });
                // update icon
                this.model.setPlayer(this.model.player);

                if (settings.graphicsEngine !== 'dom') {
                    layer.setCanvas(_canvas);
                }
                if (this.model.map) {
                    layer.offset[1] = ~~(layer.offset[1] - (layer.size[1] - self.map.cellSize[1]) / 2 - self.map.cellSize[1] / 4);
                }
//                this.layer = new NonDomLayer({
//                    canvas:_canvas,
//                    size:layer.size
//                });
//                this.layer.addChild(layer);
                layer.on('click', function () {
                    var game = this.model.map.game;
                    if (this.model.player == game.currentPlayer) {
                        game.setCurrentUnit(this.model);
                        layer.stopEvent();
                    }
                }.bind(this));
                layer.on('mouseover', function () {
                    //this.map.selectCell(self.mapCell);
                }.bind(this));

//                      layer.on('mouseover', function (e) {
//                          if (this.model.cell) {
//                              this.mapPresenter.focusOnCell(this.mapPresenter.getCellPresenter(this.model.cell));
//                          }
//                      }.bind(this));
//                      layer.on('click', function (e) {
//                          this.mapPresenter.selectObject(this);
//                      }.bind(this));
                layer.update();
            }
        });
        return UnitPresenter;
    });
