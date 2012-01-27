/**
* Class utils module
*/
define([], function() {       
    /**
    * 
    */
    function merge(target, src){
        for (var i in src) {
            src.hasOwnProperty(i) && (target[i] = src[i]);
        }
        return target;
    }

    /**
    *  Add properties of src object to target object if target object don't have a properties with same names
    */
    function mergeUndefined(target, src){

        for (var i in src) {
            src.hasOwnProperty(i) && !target.hasOwnProperty(i)  && (target[i] = src[i]);
        }
        return target;
    }


    var Inheritance = function(){};
    
    merge(Function.prototype, {
        // Универсальная функция наследования
        inheritsFrom:function(superClass) {
            // Если передавать superClass строкой, то можно реализовать асинхронную загрузку файла с superClass и привязывать его к текущему классу уже после загрузки
            if (typeof superClass == 'string') {
                superClass = window[superClass];
            }

            var superProto = Inheritance.prototype = superClass.prototype;
            var proto = new Inheritance;
            proto.constructor = this;			
            merge(this, {
                prototype:proto,
                superClass:superClass,
                superProto:superProto
            });
            return this;
        },
        extendProto:function() {
            for (var i=0; i<arguments.length; i++){
                merge(this.prototype,arguments[i]);	 
            }
            return this;
        }
    });



    /**
    * Create object by config
    * @attribute config string
    */
    construct = function(config) {
        var _class = config._class;    
        if (typeof _class == 'string') {
            _class = window[_class];
        }
        var _config = merge({},config);
        return new _class(_config);
    }
    
    window.merge = merge;
    window.mergeUndefined = mergeUndefined;
    window.construct = construct;

});

/*
//@todo problems with _defaults of parent constructor
Class.new = function() {
var superClass;
if (arguments.length >= 1) {
if (typeof arguments[0] == 'string') {
superClass = window[arguments[0]];
} else {
superClass = arguments[0];
}
} else {
superClass = Class;
}

if (arguments.length >= 2) {
var constructor = arguments[1];
var f = function() {
f.superClass.constructor.apply(this,arguments);
constructor.apply(this,arguments);
}
} else {
var f = function() {
f.superClass.constructor.apply(this,arguments);
}
}


f.inheritsFrom(superClass);
return f;
}
*/
