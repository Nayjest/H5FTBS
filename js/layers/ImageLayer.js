if (!this.env) env = {};
if (!env.imageLayerClass) env.imageLayerClass = 'layers/DomImageLayer';
//if (!env.imageLayerClass) env.imageLayerClass = 'layers/canvas/CanvasImageLayer';
var dependencies= []
if (env.imageLayerClass === 'layers/canvas/CanvasImageLayer') {
    dependencies = [
        env.imageLayerClass,
        'layers/canvas/DrawManager',
        'layers/canvas/CanvasLayerEvents'
    ];

} else {
    dependencies = [env.imageLayerClass]
}
define(dependencies,
    function (ImageLayer) {
        return ImageLayer;
    }
);