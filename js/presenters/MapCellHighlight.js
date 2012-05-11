define(['layers/AbstractLayer', 'jquery'], function (AbstractLayer, $) {
    "use strict";
    function MapCellHighlight(layerSrc, cellPresenter) {
        if (layerSrc) this.layerSrc = layerSrc;
        if (!this.layerSrc) throw new Error('MapCellHighlight: layer source is not specified.');
        this.ready = $.when(
            AbstractLayer.create(this.layerSrc).done(function (layer) {
                this.layer = layer;
                this.setCell(cellPresenter);
            }.bind(this))
        );
    }

    var Me = MapCellHighlight;
    Me.prototype = {
        layerSrc:null,
        useCellEventHandlers:true,
        setCell:function (cellPresenter) {
            this.cellPresenter = cellPresenter;
            if (cellPresenter) {
                this.layer.setOffset(cellPresenter.layer.offset).show();
                //@todo implement layer.getEventHandlers
                //@todo set by link??
                if (this.useCellEventHandlers) this.layer.setEventHandlers(cellPresenter.layer.getEventHandlers());
            } else {
                this.layer.hide();
            }
        },
        show:function () {
            this.layer.show();
        },
        hide:function () {
            this.layer.hide();
        }
    }
});
