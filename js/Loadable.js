define(['jquery','Class'], function($) {           

    Function.prototype._resourcePath = '/res';
    Function.prototype.load = function(name, callback){      
        var path = ((name[0]=='/') ? name : (this._resourcePath + '/' + name));
        /* @todo check that jquery ajax cahe enabled for $.getJson by default */         
        return $.getJson(path, function(data){
            if (!data._class) data._class = this;
            var obj = construct(data);
            callback(obj);
        });
    };


    /*
    var defaultResourcePath = '/res';
    var load = function(name, callback, defaultClass){
    return $.getJson(this._resourcePath + '/' + name, function(data){
    if (!data._class) data._class = defaultClass;
    var obj = construct(data);
    callback(obj);
    });
    };

    var Loadable = {                
    make:function(targetClass, resourcePath) {
    if (!resourcePath) resourcePath = defaultResourcePath;
    targetClass.load = function(name, callback) {
    return load(resourcePath + '/' + name, callback, targetClass);
    }
    }        
    }

    return Loadable;
    */
});