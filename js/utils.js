define([],function(){
    var Utils={};
    
    /**
    * Usage: Utils.rndInt(1,12)  or Utils.rndInt([1,12])
    */
    Utils.rndInt = function(min, max) {
        if (min instanceof Array) return Utils.rndInt(min[0],min[1]);
        return Math.floor(Math.random() * (max - min + 1)) + min;   
    }
    return Utils; 
});
   