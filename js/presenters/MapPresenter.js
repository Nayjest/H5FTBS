define(
    ['layers/AbstractLayer', 'layers/DomLayer' , 'jquery', 'presenters/MapCellHighlight', 'Class', 'presenters/MapCellPresenter', 'presenters/MapObjectPresenter', 'presenters/UnitPresenter', 'presenters/TbsUnitPresenter'],
    function (AbstractLayer, DomLayer, $, MapCellHighlight, OOP, MapCellPresenter) {
        "use strict";

        /**
         *
         * @constructor
         * @this {MapPresenter}
         * @param {Map} map
         * @param {Object} options
         */
        function MapPresenter(map, options) {
            if (!options) options = {};
            OOP.merge(this, options);
            if (options.$infoPanel) this.setInfoPanel(options.$infoPanel);
            else if (options.infoPanelSelector) this.setInfoPanel(options.infoPanelSelector);
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
                return this.layer = new DomLayer({
                    size:[map.size[0] * map.cellSize[0], map.size[1] * map.cellSize[1]],
                    css:{
                        marginTop:map.size[1] * map.cellSize[1] + 105
                        //outline:'1px solid red'
                    },
                    attr:{'class':'map-layer'}
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
                    var _class = require(obj.presenterClass);
                    var objPresenter = new _class(obj, this);
                    this.objPresenters.push(objPresenter);
                    when.push(objPresenter.ready);
                }, this);
                return $.when.apply(this, when);
            },
            /**
             * Gets cell presenter by MapCell object
             * @param {MapCell} cell
             * @return {MapCellPresenter}
             * @deprecated (I decided to save link to presenter object inside cell )
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
                    this.focusedCellHighlight.ready.done(function(highlight){
                        highlight.layer.setSize(this.map.cellSize);
                    }.bind(this));
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
            focusOnCell:function (cell) {
                if (cell && cell !== this.focusedCell) {
                    this.focusedCell = cell;
                    if (this.focusedCellHighlight) this.focusedCellHighlight.setCell(cell).show();
                    this.$infoPanel.html('<b>Территория:</b>' + cell.getInfo());
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
