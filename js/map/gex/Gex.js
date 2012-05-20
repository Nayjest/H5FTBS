/**
 * Module Gex
 *
 * Gexagonal map cell class.
 */
define(
    [
        'map/MapCell',
        'map/Map' ,
        'layers/ImageLayer',
        'Utils',
        'mouse'
    ],
    function (MapCell, Map, ImageLayer, Utils, mouse) {

        Gex = function (config) {
            Gex.superClass.apply(this, arguments);
        }
        Gex.inheritsFrom(MapCell).extendProto({

            _calculateLayerOffset:function () {
                var x = this.x;
                var y = this.y;
                var map = this.map;
                return [
                    (x * 0.991 - map.size[0] / 2) * map.cellSize[0] * 3 / 4,
                    (y * 0.991 - map.size[1] / 2 + ((x % 2 == 0) ? 0.5 : 0)) * map.cellSize[1]
                ];
            },

            /**
             *  @todo rename to getNeighboringCells
             *  @return array of neighboring cells
             */
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
                var y = (this.x % 2) ? -1 : 1;
                add(1, y);
                add(-1, y);

                return near;
            },
            topNeighbor:function () {
                var cell;
                if (cell = this.map.cells[this.x][this.y - 1]) return cell;
            },
            bottomNeighbor:function () {
                var cell;
                if (cell = this.map.cells[this.x][this.y + 1]) return cell;
            },
            topRightNeighbor:function () {
                var cell, y;
                y = this.y - this.x % 2;
                if (cell = this.map.cells[this.x + 1][y]) return cell;
            },
            topLeftNeighbor:function () {
                var cell, y;
                y = this.y - this.x % 2;
                if (cell = this.map.cells[this.x - 1][y]) return cell;
            },
            bottomRightNeighbor:function () {
                var cell, y;
                y = this.y + 1 - this.x % 2;
                if (cell = this.map.cells[this.x + 1][y]) return cell;
            },
            bottomLeftNeighbor:function () {
                var cell, y;
                y = this.y + 1 - this.x % 2;
                if (cell = this.map.cells[this.x - 1][y]) return cell;
            }

        });


        Gex.generators = {
            grass:function () {
                return {
                    _class:'Gex',
                    type:MapCell.types.plane,
                    layerSrc:'map/cell/gex/grass/layer',
                };
            },
            test:function () {
                return {
                    _class:'Gex',
                    type:MapCell.types.plane,
                    layerSrc:{
                        tag:'img',
                        attr:{
                            src:'/img/terrain/gex/test.png',
                            'class':'noselect'
                        },
                        css:{
                            position:'absolute',
                            overflow:'visible'
                        },
                        size:[74, 64]
                    }
                };
            }
        }

        return Gex;

    });