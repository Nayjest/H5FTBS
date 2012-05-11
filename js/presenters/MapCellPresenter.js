define(['layers/AbstractLayer', 'jquery'], function (AbstractLayer, $) {
    "use strict";
    function MapCellPresenter(cell, mapPresenter) {
        this.cell = cell;
        this.mapPresenter = mapPresenter;
        this.ready = $.when(
            AbstractLayer.create(cell.layerSrc).done(function (layer) {
                this.layer = layer;
                layer.setParent(mapPresenter.layer)
                layer.setOffset(this._calculateLayerOffset());
            }.bind(this))
        );
    }

    var Me = MapCellPresenter;
    Me.prototype = {
        _calculateLayerOffset:function () {
            var cell = this.cell;
            if (!cell.map) return [0, 0];
            return [
                (cell.x - cell.map.size[0] / 2) * cell.map.cellSize[0],
                (cell.y - cell.map.size[1] / 2) * cell.map.cellSize[1]
            ];
        },
        _setLayerEventHandlers:function () {
            var layer = this.layer;
            layer.on('mouseover', function (e) {
                this.mapPresenter.focusOnCell(this);
            }.bind(this));
            layer.on('click', function (e) {

            }.bind(this));
        }
    }


});
