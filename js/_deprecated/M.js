// Реализация ООП из статьи http://javascript.ru/tutorial/object/inheritance
OOP = {
        mixin:function(dst, src){
            // o - вспомогательный объект для фильтрации свойств,
            // которые есть у native Object и Object.prototype
            var o = {}
            for(var x in src){
                // копируем в dst свойства src, кроме тех, которые унаследованы от Object
                if((typeof o[x] == "undefined") || (o[x] != src[x])){
                    dst[x] = src[x];
                }
            }
            // В IE пользовательский метод toString отсутствует в for..in
            if(document.all && !document.isOpera){
                var p = src.toString;
                if(typeof p == "function" && p != dst.toString && p != o.toString &&
                p != "\nfunction toString() {\n    [native code]\n}\n"){
                    dst.toString = src.toString;
                }
            }
        },
        extends:function (Child, Parent) {
            var F = function() { };
            F.prototype = Parent.prototype;
            Child.prototype = new F();
            Child.prototype.constructor = Child;
            Child.superclass = Parent.prototype;
        }
};

M = (function(){
    // Внутри функций текущий this затирается своим, 
    // таким образом к прежнему this все еще можно будет обратится через self, хранящийся в замыкании
    var self = this;

    var dependencies = [];
    
    var Evented = function(){
        var callbacks=[];
        var eventName; 
        this.raiseEvent = function(eventName){
            for (var callback in callbacks[eventName]) {
                callback();
            }
            return this;
        }
               
        for (var i=0;i<arguments.length;i++) {
            eventName = arguments[i];
            callbacks[eventName]=[];
            this['on'+eventName]=function(callback){
                //@todo добавить предотвращение дубликатов в колл-беках, проверять на inArray()
                callbacks[eventName].push(callback);
            }
            this[eventName.toLowerCase()]=function(){} 
        }
    }
    
    var LoadedObject = function(){
        this.alias = alias;
        this.className = alias.split('.').pop();
        this._status = 'required';        
        this._onReadyHandlers = [];
        this._onLoadHandlers = [];
        this._onFailHandlers = [];        
    }
    OOP.mixin(LoadedObject,{
       onReady:function(callback){
           this.
       }
    });
    
    var DependencyList = function(){
        this.handlers = new EventHandlers();
        this.requiredFiles = [];
    }
    
    var Dependency = function(alias){
        this.alias = alias;
        this.className = alias.split('.').pop();
        this.status = 'required';        
    }

    
    var Class = function(className){
        this.className = className;    
    }
    self.OOP.extends(Class,Function);
    self.OOP.mixin(Class.prototype,{
        require:function(){  
            for (var i=0;i<agruments.length;i++) {
                dependencies[this.className].push(new Dependency(parentName));   
            }
        },
        extends:function(parentName){
            this.require(parentName);
            this.onReady(function(){self.OOP.extends(window[this.className],parentName)});
            return this;
        }
        
    });


    this.class = function(className){
        if (window[className] instanceof Class) return window[className];
        dependencies[className] = [];
        window[className] = new Class(className);
        return window[className];
    }
    
})();


M.class('ClassName')
.extends('ParentClass')
.require('SomeShit1','SomeShit2');

ClassName = Class.extends('Parent').require('')

function ClassName(params) {
    this.superClass.doSomeShit();
    this.someVal = params['someVal'];
}
M.mixin(ClassName.prototype,{
    _privateProp:5,
    someMethod:function(){
        _    
    }    
});

