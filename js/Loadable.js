define(['jquery','Class'], function($) {
    var loadMethods = {
        eval:'eval',
        json:'json'
    }
    
    var Loadable = {
        processingFiles:0,
        fileExt:'js',
        defaultMethod: loadMethods.eval,        
        onError:function(o, path, error){
            console.log('Error: Unable to load "' + path + '", additional data:',error);            
        }
    }
    
    Function.prototype._resourcePath = '/res';
    
    Function.prototype.load = function(name, callback){        
        Loadable.processingFiles++;
        var self = this;
        var _callback = function(data){            
            if (typeof(data)=='string') {
                eval('data = ' + data);                
            }
            if (!data._class) data._class = self;
            var obj = construct(data);
            Loadable.processingFiles--;            
            
            callback(obj);
        };
        
        // first arg isn't file name
        if ((typeof(name)!='string') && !(name instanceof String)) {            
            if (name instanceof self) {
                // first arg is a ready object
                callback(name)
            } else {
                //first arg is a configuration, we need to exec constructor
                _callback(name);
            }
            return true;
        }     
       
        var path = (name[0]=='/') ? name : (this._resourcePath + '/' + name );
        
        var method;        
        if (/\.js$/.test(name)) {            
            method = loadMethods.eval;            
        } else if(/\.json$/.test(name)) {
            method = loadMethods.json
        } else {          
            method = Loadable.defaultMethod;             
            if(Loadable.fileExt) { 
                var ext = '.' + Loadable.fileExt;                 
                if (name.indexOf(ext) == -1){
                    path += ext;
                }
            }    
                
        }                 
                
        /* @todo check that jquery ajax cahe enabled for $.getJson by default */         
        var requestParams = {           
            success:_callback,
            error: function(obj,error){Loadable.onError(obj,path,error)}
        }
        if (method == loadMethods.json) {
            requestParams.dataType = 'json';
        }else{
            requestParams.dataType = 'text';
        }
        
        return $.ajax(path, requestParams);            
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
    */
    return Loadable;
  
});