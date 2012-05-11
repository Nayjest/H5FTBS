define(['presenters/MapPresenter', 'zLevels'], function (MapPresenter, zLevels) {
    "use strict";
    function GexMapPresenter(map, options) {
        this.superClass.call(this, map, options);
    }
    var Me = GexMapPresenter;
    Me.inheritsFrom(MapPresenter);
    Me.extendProto({
        focusedCellHighlightLayerSrc:{ // config of layer that is drawed when
            image:'/img/cursor/gex.png',
            zIndex:zLevels.mapCellHighlight
        }
    });
    return Me;
});
