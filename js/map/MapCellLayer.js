/**
 * @todo don't include Canvas when it's not canvas mode
 */
define(['layers/ImageLayer', 'Canvas', 'layers/components/Highlight', 'Class'], function (ImageLayer, Canvas, Highlight) {
    var _canvas;
    if (ImageLayer.isCanvasEngine) {
        _canvas = Canvas.getByName('mapCells', {
            zIndex:-1
        });
    }
    var MapCellLayer = function (config) {
        var me = this;
        Me.superClass.call(this, config);
        if (ImageLayer.isCanvasEngine) {
            me.setCanvas(_canvas);
        }
        me.highlight = new Highlight(me, {});
    }
    var Me = MapCellLayer;
    Me.inheritsFrom(ImageLayer);
    return MapCellLayer;
});
