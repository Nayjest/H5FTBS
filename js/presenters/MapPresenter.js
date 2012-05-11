define(['layers/AbstractLayer', 'layers/DomLayer' , 'jquery', 'presenters/MapCellHighlight', 'Class'], function (AbstractLayer, DomLayer, $, MapCellHighlight, OOP) {
    "use strict";

    /**
     *
     * @constructor
     * @this {MapPresenter}
     * @param {Map} map
     * @param {Object} options
     */
    function MapPresenter(map, options) {
        if (options) OOP.merge(this,options);
        if (this.$infoPanel) this.setInfoPanel(this.$infoPanel);
        else if (this.infoPanelSelector) this.setInfoPanel(this.infoPanelSelector);
        this.map = map;
        this.focusedCell = null;
        this.ready = $.when(
            this._createMapLayer(),
            this._createFocusedCellHighlight()
        );
    }

    var Me = MapPresenter;
    Me.prototype = {
        layersSrc:{
            focusedCell:null,
            map:{},
            focusedUnit:null,
            activeUnit:null
        },
        infoPanelSelector:'#mapInfo',

        /**
         * @param {string | $} selector or jQuery object
         * @this {MapPresenter}
         * @return {MapPresenter}
         */
        setInfoPanel:function(infoPanel){
            if (!infoPanel) {
                this.infoPanelSelector = this.$infoPanel = null;
            } else if (typeof infoPanel === 'string') {
                this.infoPanelSelector = infoPanel;
                this.$infoPanel = $(infoPanel);
            } else {
                this.infoPanelSelector = false;
                this.$infoPanel = $(infoPanel);
            }
        },

        /**
         * @this {MapPresenter}
         * @return {MapPresenter}
         */
        _createMapLayer:function () {
            // @todo move layer config to this.mapLayerSrc and set size later
            var map = this.map;
            return this.layer = DomLayer({
                size:[map.size[0] * map.cellSize[0], map.size[1] * map.cellSize[1]],
                css:{
                    marginTop:this.size[1] * this.cellSize[1] + 105
                    //outline:'1px solid red'
                }
            });
        },
        /**
         * @return {deferred | false} false if layersSrc.focusedCell is not specified
         */
        _createFocusedCellHighlight:function(){
            if (this.layersSrc.focusedCell) {
                this.focusedCellHighlight = new MapCellHighlight(this.layersSrc.focusedCell);
                return this.focusedCellHighlight.ready;
            } else {
                return false;
            }
        },
        /**
         * @this {MapPresenter}
         * @param {MapCellPresenter|null} cellPresenter
         * @return {MapPresenter}
         */
        focusOnCell:function (cellPresenter) {
            if (cellPresenter && cellPresenter!==this.focusedCell) {
                this.focusedCell = cellPresenter;
                if (this.focusedCellHighlight) this.focusedCellHighlight.setCell(cellPresenter).show();
                this.$infoPanel.html('<b>Территория:</b>' + cellPresenter.cell.getInfo());
            } else {
                this.clearCellFocus();
            }
            return this;
        },

        /**
         * @this {MapPresenter}
         * @return {MapPresenter}
         */
        clearCellFocus:function(){
            this.$infoPanel.html('');
            if (this.focusedCellHighlight) this.focusedCellHighlight.hide();
            return this;
        }
    }
});
