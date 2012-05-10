define([], function () {
    "use strict";
    //Best way to get global object (window in browser) in strict mode
    var FN = Function, glob = FN('return this')();
    var Me = glob.Utils = glob.utils = {};

    /**
     * Usage: Utils.rndInt(1,12)  or Utils.rndInt([1,12])
     */
    Me.rndInt = function (min, max) {
        if (min instanceof Array) return Me.rndInt(min[0], min[1]);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @return distance between points p1 and p2
     */
    Me.distance = function (p1, p2) {
        return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
    }

    /**
     * return new array that contain intersection of array1 and array2
     */
    Me.arrayIntersect = function (array1, array2) {
        return array1.filter(function (n) {
            if (array2.indexOf(n) == -1)
                return false;
            return true;
        });
    }

    Me.removeFromArray = function(element, array){
        var pos = array.indexOf(element);
        if (pos===-1) {
            return false;
        } else {
            array.splice(pos,1);
        }
    }

    return Me;
});
