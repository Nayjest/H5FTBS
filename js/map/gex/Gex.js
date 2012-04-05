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
        'Mouse'
    ],
    function (MapCell, Map, ImageLayer, Utils, Mouse) {

        Gex = function (config) {
            Gex.superClass.apply(this, arguments);
        }
        Gex.inheritsFrom(MapCell).extendProto({

            _setupLayerOffset:function () {
                var x = this.x;
                var y = this.y;
                var map = this.map;
                this.layer.setOffset([
                    (x * 0.991 - map.size[0] / 2) * map.cellSize[0] * 3 / 4,
                    (y * 0.991 - map.size[1] / 2 + ((x % 2 == 0) ? 0.5 : 0)) * map.cellSize[1]
                ]);
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
            },

            /**
             * Creates layer that represents map cell highlight
             * @param string modification (green,red,etc.)
             * @return ImageLayer
             */
            createHighlightLayer:function (modification) {
                if (modification) {
                    modification = '_' + modification;
                } else {
                    modification = '';
                }
                var layer = new ImageLayer({
                    image:'/img/cursor/gex' + modification + '.png',
                    zIndex:Map.zLevels.mapCellHighlight + 1,
                    offset:this.layer.offset,
                    size:this.map.cellSize,
                    parent:this.map.layer
                });
                layer.update();
                return layer;
            },

            getClosestNeighborByCursor:function (filter) {
                //console.log(Mouse.pos, this.layer.$el.offset());
                var candidates = filter ? Utils.arrayIntersect(this.nearby(), filter) : this.nearby();
                var res = candidates.map(
                    function (cell) {
                        return {
                            cell:cell,
                            dist:Utils.distance(Mouse.pos, cell.layer.getCenterScreenPos())
                        }
                    }).sort(
                    function (a, b) {
                        return b.dist - a.dist;
                    }).pop();
                if (res) return res.cell;
            }

        });


        Gex.generators = {
            grass:function () {
                return {
                    _class:'Gex',
                    type:MapCell.types.plane,
                    layer:'map/cell/gex/grass/layer',
                };
            },
            test:function () {
                return {
                    _class:'Gex',
                    type:MapCell.types.plane,
                    layer:{
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