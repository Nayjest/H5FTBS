define(['layers/ImageLayer', 'layers/components/Highlight', 'jquery', 'Utils', 'map/MapCellLayer'], function (ImageLayer, Highlight, $, Utils, MapCellLayer) {
    var mapCellTypes = {
        road:0,
        plane:{
            id:1,
            name:'Равнина',
            description:'Обычная равнина, ничего особенного'

        },
        mountain:2,
        sand:3,
        swamp:4,
        wood:5,
        water:6,
        deepWater:7,
        ice:8,
        lava:9,
        wall:10
    },

    defaults = {
        type:mapCellTypes.plane,
        layerSrc:{}
    },
    MapCell = function (config) {
        if (config) merge(this, config);
        mergeUndefined(this, defaults);
        if (this.map) {
            this.map.cells[this.x][this.y] = this;
        }
        this.layerSrc = this.layer;
        delete(this.layer);
//        MapCellLayer.load(this.layer, function (obj) {
//            obj.on('mouseover', function (e) {
//                self.map.selectCell(self);
//            });
//            self.layer = obj;
//            self.ready = true;
//            if (config.map && typeof(config.x) == 'number' && typeof(config.y) == 'number') {
//                self.placeTo(config.map, config.x, config.y);
//            }
//            self._doOnLoad();
//        });
    }

    MapCell.types = mapCellTypes;

    MapCell.descriptions = [];
    MapCell.descriptions[MapCell.types.plane] = 'Равнина';

    MapCell.prototype = {
        placeTo:function (map, x, y) {
            var me = this;
            me.map = map;
            if (map.cells[x][y] instanceof MapCell) {
                if (map.cells[x][y] !== me){
                    map.cells[x][y].free();
                }
            }
            me.x = x;
            me.y = y;
            map.cells[x][y] = me;
            return me;
        },
        free:function () {
            var me = this;
            if (me.map.cells[me.x] && me.map.cells[me.x][me.y]) me.map.cells[me.x][me.y] = null;
        },
        nearby:function () {
            var self = this;
            var near = [];

            function add(dx, dy) {
                var x = self.x + dx;
                var y = self.y + dy;
                if (self.map.cells[x] && self.map.cells[x][y] instanceof MapCell) {
                    near.push(self.map.cells[x][y]);
                }
            }

            add(1, 0);
            add(-1, 0);
            add(0, 1);
            add(0, -1);
            return near;
        },

        distanceTo:function (cell) {
            if (cell == this) return 0;
            var selected = [this];
            var cellsByDist = [
                [this]
            ];
            var nearCells;
            var dist = 0;
            var added = 0;

            function notSelected(mapCell) {
                for (var i = selected.length;i--;) {
                    if (selected[i] == mapCell) return false;
                }
                return true;
            }

            do {
                dist++;
                cellsByDist[dist] = [];
                added = 0;
                for (var i = cellsByDist[dist - 1].length;i--;) {
                    nearCells = cellsByDist[dist - 1][i].nearby();
                    for (var j = nearCells.length;j--;) {
                        if (nearCells[j] == cell) return dist;
                        if (notSelected(nearCells[j])) {
                            selected.push(nearCells[j]);
                            cellsByDist[dist].push(nearCells[j]);
                            added++;
                        }
                    }
                }
            } while (added);
        },

        /**
         * @argument int distance
         * @argument [MapCell] selected -- Already in resulting list
         * @argument [MapCell] excludeCells -- ignore and don't cross that cells (use as obstacles)
         *
         * @todo implement exclude
         * @return list of map cells that can be reached in <distance> steps
         */
        selectByDistance:function (distance, selected, excludeCells) {
            if (!selected) selected = [this];
            if (!excludeCells) excludeCells = [];
            if (distance == 0) return selected;

            function notSelected(mapCell) {
                return selected.indexOf(mapCell) == -1
            }

            function notExcluded(mapCell) {
                return excludeCells.indexOf(mapCell) == -1
            }

            var nearCells = this.nearby();
            var cell, i;
            for (i = nearCells.length;i--;) {
                cell = nearCells[i];
                if (notSelected(cell) && notExcluded(cell)) {
                    selected.push(nearCells[i]);
                }
            }
            for (i = nearCells.length;i--;) {
                if (notExcluded(nearCells[i])) nearCells[i].selectByDistance(distance - 1, selected, excludeCells);
            }
            return selected;

        },
        _calculateLayerOffset:function () {
            return [
                (this.x - this.map.size[0] / 2) * this.map.cellSize[0],
                (this.y - this.map.size[1] / 2) * this.map.cellSize[1]
            ];
        },
        //@deprecated
        select:function () {
            this.map.selectCell(this);
        },
        getInfo:function () {
            return '[' + this.x + ',' + this.y + ']<br> ' + MapCell.descriptions[this.type];
        },

        /**
         * @return array of units located on this map cell
         */
        getUnits:function () {
            return this.map.getUnitsAt(this.x, this.y);
        },

        getObjects:function () {
            return this.map.getObjectsAt(this.x, this.y);
        },
        /**
         * @deprecated
         * @compatibility
         * @param callback
         */
        onLoad:function (callback) {
            callback(this);
        }

    }

    MapCell.generators = {
        grass:function () {
            return {
                _class:'MapCell',
                type:MapCell.types.plane,
                layerSrc:{
                    tag:'img',
                    attr:{
                        src:'/img/terrain/grass1/grass1_r1.png'
                    },
                    css:{
                        position:'absolute'
                    }
                }
            };
        }
    }

    return MapCell;
});
