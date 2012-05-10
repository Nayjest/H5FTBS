/**
 * Module settings
 *
 * Modules that uses setting must not require it. Do it at bootstrap.
 * Don't add redundant dependency to modules that use settings.
 * Just take settings from global object. If it's absent, use default values.
 */
define([], function () {
    "use strict";
    //Get global object (window in browser) in strict mode
    var FN = Function,
        glob = FN('return this')(),
        AUTO = null,
    settings = {
        /* possible values: 'dom', 'canvas', 'webgl', 'webgl-2d' */
        graphicsEngine:'webgl-2d',
        /* @var int redrawInterval Redraw interval for canvas layers DrawManager */
        redrawInterval:30,
        /* DEBUG OPTIONS */
        debug:true,
        globals:AUTO,
        logLoadedModules:AUTO

    }
    if (settings.globals === AUTO) settings.globals = settings.debug;
    if (settings.logLoadedModules === AUTO) settings.logLoadedModules = settings.debug;
    glob.settings = settings;
    settings.debug && console.log('Settings:',settings);
    return settings;
});
