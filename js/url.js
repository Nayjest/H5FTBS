define([], function () {
    "use strict";
    var getVars;
    var me = {
        getParams:function (name) {
            if (name) {
                return me.getParams()[name];
            }
            if (typeof(getVars) !== 'undefined') {
                return getVars;
            }
            getVars = {};
            var hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                if (hash.length < 2) {
                    getVars[hash[0]] = null;
                } else {
                    getVars[hash[0]] = hash[1];
                }
            }
            return getVars;
        }
    }
    return me;
});
