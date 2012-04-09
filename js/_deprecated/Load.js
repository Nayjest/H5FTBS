/**
* Библиотека Load для динамической загрузки JavaScript/CSS/Картинок и обеспечения модульной структуры JS-приложения
* 
* @author Vitaliy Stepanenko <mail@vitaliy.in>
* 
*/
console.log(window.location);
console.log('ok');
var Load = new function(){

    //Нужно отрефакторить, т. к. работает только с 2х и 3х -символьными расширениями
    function _detectFileType(url){		
        var fileExtension = url.substr(url.length-3).replace('.', '').toLowerCase();		
        return (fileExtension in {jpg:1,png:1,gif:1})?'img':fileExtension;
    };

    /**
    * Функции, которые просто подгружают файлы и возвращают DOM элемент
    */
    var _basic = {
        js:function(url){
            var el = document.createElement('script');
            el.setAttribute('type', 'text/javascript');
            el.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(el);
            return el;
        },
        css:function(url){
            var el = document.createElement('link');
            el.setAttribute('rel', 'stylesheet');
            el.setAttribute('type', 'text/css');
            el.setAttribute('href', url);
            document.getElementsByTagName('head')[0].appendChild(el);
            return el;	
        },
        img:function(url){
            el = new Image(); 
            el.src = url;
            return el;	
        },
        file:function(url){		
            var fileType = _detectFileType(url);
            return this[fileType].call(this,url);		
        },

    };

    //список загруженных файлов
    var _requiredFiles = {
        img:{},
        css:{},
        js:{},        
    };
    // Массив групповых загрузок
    var _loadingGroups = [];

    /** 
    * @param String fileType <'img'|'css'|'js'>      
    * @param Array [status1, status2, ... , statusN]
    * @return true Если хотя бы один загружаемый ресурс типа fileType имеет любой статус из массива statuses
    */
    function _haveStatuses(fileList, statuses) {				
        for(var url in fileList) {									
            for(var i in statuses) {
                if (fileList[url].status == statuses[i]) {					
                    return true;
                }	
            }
        }
        return false;
    }

    function _isEnded(fileList){
        return !_haveStatuses(fileList, [Load.STATUS.LOADING]);
    }

    function _isCompleted(fileList){
        return !_haveStatuses(fileList, [Load.STATUS.LOADING, Load.STATUS.FAILED]);    
    }

    var Load = {
        STATUS:{
            FAILED:    -1,			
            NOT_requiredFiles: 0,
            LOADING:    1,
            COMPLETE:   2,

        }			
    };

    

    /**
    *  Обновляет статус ресурса и вызывает обработчики onEnd, onComplete.
    * Обработчики общие в рамках одного fileType, например js или css. @todo исправить это, внедрить зависимости
    */
    function _onElementLoaded(url) {
        var fileType = _detectFileType(url);		
        var file = _requiredFiles[fileType][url];
        file.status = Load.STATUS.COMPLETE;
        
        if (_isCompleted(file.group.files)){
           while (fn = file.group._onCompleteHandlers.shift()) {
                fn();
            }             
        }
        
        if (_isEnded(file.group.files)){
           while (fn = file.group._onEndHandlers.shift()) {
                fn();
            }             
        }		
        
        var all = Load[fileType].all;
        if (all.ended()) {
            while (fn = all._onEndHandlers.shift()) {
                fn();
            }			
        }

        if (all.complete()) {
            while (fn = all._onCompleteHandlers.shift()) {
                fn();
            }			
        }

    }

    function _attachLoadingEvents(el, url) { 		
        el.onreadystatechange = function () {
            if (el.readyState == 'complete') {
                _onElementLoaded(url);
            } // @todo а вот сюда добавить обработку для STATUS.FAILED, etc.
        };
        // @todo узнать, нахера я делал еще и el.onload кроме el.onreadystatechange. 
        // С кроссбраузерностью беда, что-ли? 2 раза дергаться обработчики не будут?
        el.onload = function () {
            _onElementLoaded(url);
        };
    }

    /**
    * Если произвольная функция принимает список аргументов или же один/несколько аргументов в виде массивов, 
    * все это будет развернуто в один плоский массив с помощью _toPlainArray(arguments)
    */
    function _toPlainArray(args) {
        var res = []; 
        for (var i=0; i < args.length; i++){            
            if (args[i] instanceof Array) { // @todo это плохой isArray()                
                for (var j=0; j < args[i].length; j++){
                    res.push(args[i][j]);
                }    
            } else {
                res.push(args[i]);
            }   
        }

        return res;    
    }



    var _load = function(fileType,url) {
        var file = _requiredFiles[fileType][url];
        if (typeof file == 'undefined') {
            var el = (_basic[fileType])(url);                
            _attachLoadingEvents(el, url);
            _requiredFiles[fileType][url] = file = {
                status: Load.STATUS.LOADING,
                el: el
            };            
        }
        return file;
    }

    var _lastGroup;
    
    for (var methodName in _basic){		
        /**
        * Самовызывающаяся анонимная функция, добавляет в Load методы-обертки над _basic, 
        * с поддержкой событий и произвольного кол-ва аргументов
        */         
        new function(methodName){				
            var method = function(){								
                var urls = _toPlainArray(arguments);                

                var loadingGroup = {
                    status:Load.STATUS.LOADING,
                    files:[],
                    _onEndHandlers:[],
                    _onCompleteHandlers:[]
                };
                _loadingGroups.push(loadingGroup);

                for (var i=0; i < urls.length; i++){
                    var url = urls[i];
                    var fileType = _detectFileType(url);                                                                                    
                    if (url in _requiredFiles[fileType]) {
                        // вот здесь дергать события?
                    } else {    
                        var el = (_basic[fileType])(url);                
                        _attachLoadingEvents(el, url);
                        _requiredFiles[fileType][url] = {
                            status: Load.STATUS.LOADING,
                            el: el,
                            group:loadingGroup
                        };            
                    }
                    loadingGroup.files.push(_requiredFiles[fileType][url]);
                    
                }
                //console.log(_loadingGroups);
                //console.log(_requiredFiles);
                _lastGroup = loadingGroup;
                return Load;
            };    

            method.all = {
                ended: function(){
                    return _isEnded(_requiredFiles[methodName]);
                    
                },

                complete: function(){
                    return _isCompleted(_requiredFiles[methodName]);
                },

                /**
                *  @todo make _onEndHandlers, _onCompleteHandlers private
                */
                _onEndHandlers:[],
                _onCompleteHandlers:[],
                onEnd:function(fn){this._onEndHandlers.push(fn)},
                onComplete:function(fn){this._onCompleteHandlers.push(fn)}
            };
            Load[methodName] = method;

        }(methodName);	
    };	
    Load.onEnd=function(fn){_lastGroup._onEndHandlers.push(fn)};
    Load.onComplete=function(fn){_lastGroup._onCompleteHandlers.push(fn)};
    return Load;	
}();
