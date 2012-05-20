define(['layers/AbstractLayer', 'jquery'], function (AbstractLayer, $) {
    "use strict";
    function MapCellHighlight(layerSrc, /*optional*/cell) {
        if (layerSrc) this.layerSrc = layerSrc;
        if (!this.layerSrc) throw new Error('MapCellHighlight: layer source is not specified.');
        this.ready = $.Deferred();
        AbstractLayer.create(this.layerSrc).done(function (layer) {
            this.layer = layer;
            this.setCell(cell);
        }.bind(this)).done(function () {
            this.ready.resolve(this);
        }.bind(this));

    }

    var Me = MapCellHighlight;
    MapCellHighlight.prototype = {
        layerSrc:null,
        useCellEventHandlers:false,
        setCell:function (cell) {
            this.cell = cell;
            if (cell) {
                this.layer.setOffset(cell.presenter.layer.offset).show();
                //@todo implement layer.getEventHandlers
                //@todo set by link??
                if (this.useCellEventHandlers) {
                    this.layer.setEventHandlers(cell.presenter.layer.getEventHandlers());
                }
            } else {
                this.layer.hide();
            }
            return this;
        },
        show:function () {
            this.layer.show();
        },
        hide:function () {
            this.layer.hide();
        },
        destroy:function(){
            this.layer.destroy();
        }
    };
    return MapCellHighlight;
});
