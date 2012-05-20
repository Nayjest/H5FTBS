define(['presenters/MapPresenter', 'zLevels', 'layers/ImageLayer'], function (MapPresenter, zLevels, ImageLayer) {
    "use strict";
    function GexMapPresenter(map, options) {
        Me.superClass.call(this, map, options);
    }

    var Me = GexMapPresenter;
    Me.inheritsFrom(MapPresenter);
    Me.extendProto({
        layersSrc:{
            focusedCell:{ // config of layer that is drawed when
                image:'/img/cursor/gex.png',
                zIndex:zLevels.map.cellHighlight,
                _class:ImageLayer
            },
            map:{},
            focusedUnit:null,
            activeUnit:null
        }
    });
    //Me.prototype.layersSrc.focusedCell = null;
    return Me;
});
