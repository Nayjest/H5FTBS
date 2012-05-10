define([], function () {
    function MapObjectLayerBehavior(obj, layer) {
        layer.on('click', function () {
            obj.select(obj.map.game.currentPlayer);
        });
        layer.on('mouseover', function () {
            obj.map.selectCell(obj.mapCell);
        });
    }
    return MapObjectLayerBehavior;
});
