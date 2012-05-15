define(
    ['layers/AbstractLayer', 'jquery', 'map/MapCell'],
    function (AbstractLayer, $, MapCell) {
        "use strict";
        function MapObjectPresenter(model, mapPresenter) {
            this.model = model;
            this.mapPresenter = mapPresenter;
            this.ready = $.when(
                AbstractLayer.create(model.layerSrc).done(function (layer) {
                    this.layer = layer;
                    //@todo check do we need this? (setParent)
                    layer.setParent(mapPresenter.layer);
                    if (model.cell) {
                        layer.setOffset(model.cell._calculateLayerOffset());
                    }
                    layer._setLayerEventHandlers();
                }.bind(this))
            );
        }

        var Me = MapObjectPresenter;
        MapObjectPresenter.prototype = {
            _setLayerEventHandlers:function () {
                var layer = this.layer;
                layer.on('mouseover', function (e) {
                    if (this.model.cell) {
                        this.mapPresenter.focusOnCell(this.mapPresenter.getCellPresenter(this.model.cell));
                    }
                }.bind(this));
                layer.on('click', function (e) {
                    this.mapPresenter.selectObject(this);
                }.bind(this));
            }
        }
        return Me;
    });
