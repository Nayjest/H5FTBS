/**
 * @todo don't include Canvas when it's not canvas mode
 * @todo implement as mixin
 */
define(['layers/ImageLayer', 'Canvas', 'layers/components/Highlight', 'Class'], function (ImageLayer, Canvas) {
    var _canvas;
    if (ImageLayer.isCanvasEngine) {
        _canvas = Canvas.getByName('units', {
            zIndex:1
        });
    }
    var UnitLayer = function (config) {
        var me = this;
        Me.superClass.call(this, config);
        if (ImageLayer.isCanvasEngine) {
            me.setCanvas(_canvas);
        }
    }
    var Me = UnitLayer;
    Me.inheritsFrom(ImageLayer);
    return UnitLayer;
});