/**
 * MapObject class
 */
define(['layers/ImageLayer', 'Loadable', 'utils', 'map/MapObjectLayerBehavior'], function (ImageLayer, Loadable, utils, MapObjectLayerBehavior) {

    /**
     * @param config
     */
    var MapObject = function (config) {
        this._onLoad = [];
        if (config) merge(this, config);
        this._initLayer();
    };
    var Me = MapObject;

    MapObject.prototype = {
        /* ===============Defaults============== */
        layer:null,
        description:'No info',
        /**
         * @var bool|string|array
         * true: can pass any case
         * false: can't pass any case
         * MapCell.movementTypes.fly -- fly only (add limitations for all other)
         * [MapCell.movementTypes.fly, MapCell.movementTypes.walk] (add limitations for all other, no swim in this case)
         */
        passable:false, //@todo rename to isPassable
        /* =============End defaults============= */
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
            // @todo Replace to some abstract layer
            ImageLayer.create(this.layer).done(function (layer) {
                MapObjectLayerBehavior(this, layer)
                this.layer = layer;
                this.ready = true;
                this._doOnLoad();
            }.bind(this));
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

            if (this.map && this.map.objects) {
                utils.removeFromArray(this, this.map.objects)
            }
            if (this.layer && this.layer.destroy) {
                this.layer.destroy();
            }
        },
        select:function () {
            //@todo
            console.log('selected!');
        },

        getInfo:function () {
            return this.description;
        }

    }

    return MapObject;

});