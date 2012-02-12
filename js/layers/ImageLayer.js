if (!this.env) env = {};
define(
    [
        env.imageLayerClass ? env.imageLayerClass : 'layers/DomImageLayer'//'layers/canvas/CanvasImageLayer'
    ],
    function (ImageLayer) {
        return ImageLayer;
    });