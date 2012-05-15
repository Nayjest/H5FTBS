/**
 * MapObject class
 */
define(['layers/ImageLayer', 'Loadable', 'utils', 'map/MapObjectLayerBehavior'], function (ImageLayer, Loadable, utils, MapObjectLayerBehavior) {

    /**
     * @param config
     */
    var MapObject = function (config) {
        if (config) merge(this, config);
        //@deprecated @compatibility
        if (!this.layerSrc && this.layer) this.layerSrc = this.layer;
    };
    var Me = MapObject;

    MapObject.prototype = {
        /* ===============Defaults============== */
        layerSrc:null,
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
            map.objects.push(this);
            return this;
        },
        /**
         * @deprecated @compatibility
         * @param callback
         */
        onLoad:function (callback) {
                callback(this);
        },
        destroy:function () {

            if (this.map && this.map.objects) {
                utils.removeFromArray(this, this.map.objects)
            }
        },
        getInfo:function () {
            return this.description;
        }

    }

    return MapObject;

});