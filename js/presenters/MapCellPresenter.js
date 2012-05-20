define(
    ['layers/AbstractLayer', 'jquery', 'zLevels', 'presenters/MapCellHighlight', 'layers/ImageLayer', 'Player', 'utils', 'mouse'],
    function (AbstractLayer, $, zLevels, MapCellHighlight, ImageLayer, Player, utils, mouse) {
        "use strict";
        function MapCellPresenter(cell, mapPresenter) {
            this.cell = cell;
            cell.presenter = this;
            this.mapPresenter = mapPresenter;
            this.ready = $.when(
                AbstractLayer.create(cell.layerSrc).done(function (layer) {
                    this.layer = layer;
                    layer.setParent(mapPresenter.layer)
                    layer.setOffset(cell._calculateLayerOffset());
                    this._onLayerLoaded();
                }.bind(this))
            );
        }

        var Me = MapCellPresenter;
        MapCellPresenter.prototype = {
            _onLayerLoaded:function () {

                var layer = this.layer;
                console.log('create presenter for cell, init layer', layer);
                layer.on('mouseover', function (e) {
                    this.mapPresenter.focusOnCell(this.cell);
                    layer.stopEvent();
                }.bind(this));

                layer.on('click', function () {
                    var units = this.cell.getUnits();
                    if (!units.length) return;
                    var game = this.cell.map.game;
                    if (game
                        && game.currentPlayer
                        && (game.currentPlayer.controller === Player.controllers.local)
                        && (units[0].player == game.currentPlayer)
                        ) {
                        game.setCurrentUnit(units[0]);
                        layer.stopEvent();
                    }
                }.bind(this));
            },
            /**
             * Creates layer that represents map cell highlight
             * @param string modification (green,red,etc.)
             * @return ImageLayer
             */
            createHighlightLayer:function (modification) {
                if (modification) {
                    modification = '_' + modification;
                } else {
                    modification = '';
                }
                var hl = new MapCellHighlight({
                    image:'/img/cursor/gex' + modification + '.png',
                    zIndex:zLevels.map.cellHighlight,
                    size:this.cell.map.cellSize,
                    _class:ImageLayer
                }, this.cell);
                return hl;
            },
            getClosestNeighborByCursor:function (filter) {
                //console.log(mouse.pos, this.layer.$el.offset());
                var cell = this.cell;
                var candidates = filter ? utils.arrayIntersect(cell.nearby(), filter) : cell.nearby();
                var res = candidates.map(
                    function (cell) {
                        return {
                            cell:cell,
                            dist:utils.distance(mouse.pos, cell.presenter.layer.getCenterScreenPos())
                        }
                    }).sort(
                    function (a, b) {
                        return b.dist - a.dist;
                    }).pop();
                if (res) return res.cell;
            }

        }
        return Me;
    });
