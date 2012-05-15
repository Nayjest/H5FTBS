define(['layers/AbstractLayer', 'jquery'], function (AbstractLayer, $) {
    "use strict";
    function MapCellPresenter(cell, mapPresenter) {
        this.cell = cell;
        this.mapPresenter = mapPresenter;
        this.ready = $.when(
            AbstractLayer.create(cell.layerSrc).done(function (layer) {
                this.layer = layer;
                layer.setParent(mapPresenter.layer)
                layer.setOffset(cell._calculateLayerOffset());
                layer._setLayerEventHandlers();
            }.bind(this))
        );
    }
    var Me = MapCellPresenter;
    MapCellPresenter.prototype = {
        _setLayerEventHandlers:function () {
            var layer = this.layer;
            layer.on('mouseover', function (e) {
                this.mapPresenter.focusOnCell(this);
            }.bind(this));
            layer.on('click', function (e) {

            }.bind(this));
        }
    }
    return Me;
});
