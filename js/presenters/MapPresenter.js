define(
    ['layers/AbstractLayer', 'layers/DomLayer' , 'jquery', 'presenters/MapCellHighlight', 'Class', 'presenters/MapCellPresenter', 'presenters/MapObjectPresenter'],
    function (AbstractLayer, DomLayer, $, MapCellHighlight, OOP, MapCellPresenter, MapObjectPresenter) {
        "use strict";

        /**
         *
         * @constructor
         * @this {MapPresenter}
         * @param {Map} map
         * @param {Object} options
         */
        function MapPresenter(map, options) {
            if (options) OOP.merge(this, options);
            if (this.$infoPanel) this.setInfoPanel(this.$infoPanel);
            else if (this.infoPanelSelector) this.setInfoPanel(this.infoPanelSelector);
            this.map = map;
            this.focusedCell = null;
            this.ready = $.when(
                this._createMapLayer(),
                this._createFocusedCellHighlight(),
                this._createCellPresenters(),
                this._createObjectPresenters()
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
            setInfoPanel:function (infoPanel) {
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
            _createCellPresenters:function () {
                this.cellPresenters = [];
                var when = [];
                this.map.getCellsPlain().forEach(function (cell) {
                    var cellPresenter = new MapCellPresenter(cell, this);
                    this.cellPresenters.push(cellPresenter);
                    when.push(cellPresenter.ready);
                }, this);
                return $.when.apply(this, when);
            },
            _createObjectPresenters:function () {
                this.objPresenters = [];
                var when = [];
                this.map.objects.forEach(function (obj) {
                    var objPresenter = new MapObjectPresenter(obj, this);
                    this.objPresenters.push(objPresenter);
                    when.push(objPresenter.ready);
                }, this);
                return $.when.apply(this, when);
            },
            /**
             * Gets cell presenter by MapCell object
             * @param {MapCell} cell
             * @return {MapCellPresenter}
             */
            getCellPresenter:function (cell) {
                for (var i = this.cellPresenters.length; i--;) {
                    if (this.cellPresenters[i].cell == cell) {
                        return this.cellPresenters[i];
                    }
                }
                throw new Error('Cell presenter isn\'t available.');
            },

            /**
             * @return {deferred | false} false if layersSrc.focusedCell is not specified
             */
            _createFocusedCellHighlight:function () {
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
                if (cellPresenter && cellPresenter !== this.focusedCell) {
                    this.focusedCell = cellPresenter;
                    if (this.focusedCellHighlight) this.focusedCellHighlight.setCell(cellPresenter).show();
                    this.$infoPanel.html('<b>Территория:</b>' + cellPresenter.cell.getInfo());
                } else {
                    this.clearCellFocus();
                }
                return this;
            },
            selectObject:function (objectPresenter) {
                //@todo
                console.log('object selected');
            },

            /**
             * @this {MapPresenter}
             * @return {MapPresenter}
             */
            clearCellFocus:function () {
                this.$infoPanel.html('');
                if (this.focusedCellHighlight) this.focusedCellHighlight.hide();
                return this;
            }
        };

        return Me;

    });
