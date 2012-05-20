define(
    ['layers/AbstractLayer', 'jquery', 'layers/Layer'],
    function (AbstractLayer, $, Layer) {
        "use strict";
        function MapObjectPresenter(model, mapPresenter) {
            this.model = model;
            model.presenter = this;
            this.mapPresenter = mapPresenter;
            this._createLayer();
            this.ready = $.when(
                AbstractLayer.create(model.layerSrc).done(function (layer) {
                    this._onLayerLoaded(layer);
                }.bind(this))
            );
            model.on('destroy', function () {
                this.layer.destroy();
            }.bind(this));
        }

        var Me = MapObjectPresenter;
        MapObjectPresenter.prototype = {
            _createLayer:function () {
                this.layer = new Layer()
                    .setParent(this.mapPresenter.layer)
                    .setOffset(this.model.mapCell._calculateLayerOffset());
            },
            _onLayerLoaded:function (layer) {
                layer.setParent(this.layer);
                //var layer = this.layer;
//                layer.on('mouseover', function (e) {
//                    if (this.model.mapCell) {
//                        this.mapPresenter.focusOnCell(this.mapPresenter.getCellPresenter(this.model.cell));
//                    }
//                }.bind(this));
                layer.on('click', function (e) {
                    this.mapPresenter.selectObject(this);
                }.bind(this));
            }
        }
        return Me;
    });
