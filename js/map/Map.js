define(
    [
        'map/MapCell',
        'map/MapObject',
        'map/Unit',
        'tbsGame/tbsUnit',
        'layers/DomLayer',
        'layers/ImageLayer',
        'jquery',
        'Class'
    ],
    function (MapCell, MapObject, Unit, TbsUnit, DomLayer, ImageLayer, $, OOP) {
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
            objects:[], // configuration or instances of map objects
            units:[],
            cells:[]
        }

        var Map = function (config) {
            var options = merge({}, config),
                me = this;
            OOP.mergeUndefined(options, defaults);
            this.size = options.size;
            this.cellSize = options.cellSize;
            this.ready = $.Deferred();
            this._initCells(options.cells.slice(0)).done(function () {
                $.when(
                    me._initObjects(options.objects.slice(0)),
                    me._initUnits(options.units.slice(0))
                ).done(function(){
                    this.ready.resolve(this);
                }.bind(this));
            }.bind(this));


            //MapCell selected at current moment
            this.selectedCell = null;

        }
        Map.prototype = {
            /**
             * Initialize map cells by 2 dimensional array.
             * Array elements can be:
             *  1) Instance of MapCell
             *  2) Deferred object that will return instance of MapCell
             *  3) Object containing configuration of map cell
             *  4) String file name
             * @param cells
             */
            _initCells:function (cells) {
                var waitingFor = [];
                var map = this;
                map._clearCells();
                for (var x = cells.length; x--;) {
                    for (var y = cells[x].length; y--;) {
                        (function (x, y) {
                            waitingFor.push(MapCell.create(cells[x][y]).done(function (cell) {
                                cell.placeTo(map, x, y);
                            }));
                        })(x, y);
                    }
                }
                return $.when.apply($, waitingFor).promise();
            },
            _initObjects:function (objects) {
                var map = this;
                this.objects = [];
                return MapObject.createAll(objects, function (obj) {
                    obj.placeTo(map, obj.x, obj.y);
                });
            },
            _initUnits:function (units) {
                var map = this;
                this.units = [];
                return TbsUnit.createAll(units, function (obj) {
                    obj.placeTo(map, obj.x, obj.y);
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
            attachPlayers:function(players) {
                for(var i = players.length, id;i--;){
                    if (!(id=players[i].id)) continue;
                    for(var j = this.units.length, unit;j--;){
                        unit = this.units[j];
                        if (unit.player == id){
                            unit.setPlayer(players[i]);
                        }
                    }
                }
            },
            /**
             * @return {MapCell[]} map cells as plain array
             */
            getCellsPlain:function() {
                return Array.prototype.concat.apply([],this.cells);
            }
        }

        Map.zLevels = zLevels;
        return Map;

    }
);
