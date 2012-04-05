/**
 * MapObject class
 */
define(['layers/ImageLayer', 'Loadable'], function (ImageLayer) {

    var defaults = {
        layer:null,
        description:'No info',

        /**
         * @var bool|string|array
         * true: can pass any case
         * false: can't pass any case
         * MapCell.movementTypes.fly -- fly only (add limitations for all other)
         * [MapCell.movementTypes.fly, MapCell.movementTypes.walk] (add limitations for all other, no swim in this case)
         *
         */
        passable:false
    }

    /**
     *
     * @param config
     */
    var MapObject = function (config) {
        var self = this;
        this._onLoad = [];
        if (config) merge(this, config);
        mergeUndefined(this, defaults);
        this._initLayer();
    }

    MapObject.prototype = {
        placeTo:function (map, x, y) {
            var self = this;
            this.map = map;
            this.mapCell = map.cells[x][y];
            this.mapCell.onLoad(function (cell) {
                self.onLoad(function () {
                    self.layer
                        .setParent(map.layer)
                        .setOffset(cell.layer.offset)
                        .update();
                })
            });
            map.objects.push(this);
            return this;
        },
        _initLayer:function () {
            var self = this;
            ImageLayer.load(this.layer, function (layer) {
                layer.on('click', function () {
                    self.select(self.map.game.currentPlayer);
                });
                layer.on('mouseover', function () {
                    self.map.selectCell(self.mapCell);
                });
                self.layer = layer;
                self.ready = true;
                self._doOnLoad();

            });
        },
        onLoad:function (callback) {
            if (!this.ready)
                this._onLoad.push(callback);
            else
                callback(this);
        },
        /**
         * Execute onload handlers
         */
        _doOnLoad:function () {
            for (var i = 0; i < this._onLoad.length; i++) {
                this._onLoad[i](this);
            }
        },
        destroy:function () {
            for (var i in this.map.objects) {
                if (this.map.objects[i] == this) {
                    delete(this.map.objects[i]);
                }
            }
            this.layer.destroy();
        },
        select:function () {
            console.log('selected!');
        },

        getInfo:function () {
            return this.description;
        }

    }

    return MapObject;

});