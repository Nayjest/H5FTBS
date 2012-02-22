/**
 * This module makes AMD modules exported data available in global scope.
 * (It affects to modules, loaded after calling start method)
 */
define([], function () {
    "use strict";
    var FN = Function,
        glob = FN('return this')(),
//        _require = glob.require,
        _define = glob.define;
    return {
        silent:false,
        start:function () {
            var me = this;
            console.log('"globalize modules" enabled', glob);
//            glob.require = function () {
//                console.log('require:', arguments[0]);
//                return _require.apply(glob, Array.prototype.slice.call(arguments, 0));
//            }
            glob.define = function () {
                var deps = arguments[0];
                if (deps && Object.prototype.toString.call(deps) === '[object Array]' && deps.length) {
                    deps.forEach(function(d){
                        var name = d.split('/').pop().replace(/\-\.\?\#\@/, '_');
                        me.silent || console.log('define', d, ' as ', name);
                        require([d], function (exportedData) {
                            glob[name] = exportedData;
                        });
                    });
                }

                return _define.apply(glob, Array.prototype.slice.call(arguments, 0));
            }
        },
        stop:function () {
//            glob.require = _require;
            glob.define = _define;
        }
    }
});
