define(['map/MapObject', 'layers/DomLayer', 'layers/ImageLayer', 'jquery', 'Class'], function (MapObject, DomLayer, ImageLayer, $) {

    // Terrain levels for drawing order
    var zLevels = {
        back:[0],
        water:[1, 4],
        ground:[5, 8],
        mapCellHighlight:9,
        mountains:[10, 19],
        groundDecorations:[20, 29],
        trees:[30, 39],
        buildings:[40, 49],
        objects:[50, 59],
        units:[60, 69],
        effects:[70, 79],
        gui:[100]
    }

    // default values for map
    var defaults = {
        size:[10, 10], //size in cells
        cellSize:[74, 64], // cell sizein pixels
        selectedCellHoverLayer:{ // config of layer that is drawed when
            image:'/img/cursor/gex.png',
            zIndex:zLevels.mapCellHighlight
        },
        $infoPanel:'#mapInfo', // jquery object that represents dom element of info panel
        objects:[], // configuration or instances of map objects
        units:[],
    }

    Map = function (config) {
        var options = merge({}, config),
            me = this;
        mergeUndefined(options, defaults);
        this.size = options.size;
        this.cellSize = options.cellSize;
        this._createLayer();
        this._clearCells();
        var objects = options.objects.slice(0);
        for (var i = objects.length; i--;) {
            if (!(objects[i] instanceof MapObject)) objects[i] = construct(objects[i]);
            objects[i].placeTo(this, objects[i].x, objects[i].y);
        }
        this.objects= objects;

        this.units = options.units;

        //MapCell selected at current moment 
        this.selectedCell = null;
        this.selectedCellHoverLayer = new ImageLayer(options.selectedCellHoverLayer);
        this.selectedCellHoverLayer.onLoad(function () {
            console.log(me.selectedCellHoverLayer);
            me.selectedCellHoverLayer.setSize(me.cellSize);
            me.selectedCellHoverLayer.setParent(me.layer);
        })
        this.$infoPanel = $(options.$infoPanel);

    }
    Map.prototype = {
        _createLayer:function () {
            this.layer = new DomLayer({
                size:[this.size[0] * this.cellSize[0], this.size[1] * this.cellSize[1]],
                css:{
                    marginTop:this.size[1] * this.cellSize[1] + 105
                    //outline:'1px solid red'
                }
            });
        },
        _clearCells:function () {
            this.cells = [];
            for (var x = 0; x < this.size[0]; x++) {
                this.cells[x] = [];
                for (var y = 0; y < this.size[1]; y++) {
                    this.cells[x][y] = null;
                }
            }

        },
        selectCell:function (cell) {
            this.selectedCell = cell;
            if (cell) {
                this.selectedCellHoverLayer.show().setOffset(cell.layer.offset);
                this.$infoPanel.html('<b>Территория:</b>' + cell.getInfo());
            } else {
                this.$infoPanel.html('');
                this.selectedCellHoverLayer.hide();
            }
            return this;
        },

        /**
         * @return [Unit]
         */
        getUnitsAt:function (x, y) {
            var cell;
            var units = [];
            for (var i = this.units.length; i--;) {
                cell = this.units[i].mapCell;
                if (cell && (cell.x == x) && (cell.y == y)) units.push(this.units[i]);
            }
            return units;
        },

        /**
         * @return [Object]
         */
        getObjectsAt:function (x, y) {
            var cell;
            var objects = [];
            for (var i = this.objects.length; i--;) {
                cell = this.objects[i].mapCell;
                if (cell && (cell.x == x) && (cell.y == y)) objects.push(this.objects[i]);
            }
            return objects;
        },

        export:function () {
            var config = {};
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    config[i] = this[i];
                }
            }
        }
    }

    Map.zLevels = zLevels;

    return Map;

});
