"use strict";
/* Get global object (window in browser) in strict mode */
var FN = Function,
    glob = FN('return this')(),
    /* Get settings from global object */
    settings = glob.settings = glob.settings ? glob.settings : {};
/* default settings */
if (!settings.graphicsEngine) settings.graphicsEngine = 'dom';
/* module dependencies according to specific graphicEngines */
var dependencies = {
    canvas:['layers/canvas/CanvasImageLayer', 'layers/canvas/DrawManager'],
    dom:['layers/DomImageLayer'],
    webgl:[],
    'webgl-2d':['layers/canvas/CanvasImageLayer', 'layers/canvas/DrawManager', 'layers/webgl-2d/enable']
}
define(dependencies[settings.graphicsEngine],
    function (ImageLayer) {
        return ImageLayer;
    }
);

