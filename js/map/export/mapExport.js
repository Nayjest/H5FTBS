define([], function () {
    function wrapToModule(source) {
        return 'define([],function(){var export =  ' + source + '; return export;});';
    }

    return function (map) {
        var strMap = JSON.stringify(map);
        strMap = wrapToModule(strMap);
        return strMap;
    }
});