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
    canvas:['layers/NonDomLayer'],
    dom:['layers/DomLayer'],
    webgl:[],
    'webgl-2d':['layers/NonDomLayer']
}
define(dependencies[settings.graphicsEngine],
    function (Layer) {
        return Layer;
    }
);

