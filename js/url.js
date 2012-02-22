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
            getVars = [];
            var hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                getVars.push(hash[0]);
                getVars[hash[0]] = hash[1];
            }
            return getVars;
        }
    }
    return me;
});
