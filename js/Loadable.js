/**
 *  Module Loadable
 *  Extends function prototype by adding possibility to load objects from JSON or JS files.
 *
 *  Usage:
 *  MyConstructor.load('map/map/demo1') -- load and evaluate js
 *  MyConstructor.load('map/map/demo1.js') -- load and evaluate js
 *  MyConstructor.load('map/map/demo1.json') -- load and parse as json
 *  MyConstructor.load('/res/map/map/demo1') -- load from site root (ignoring _resourcePath property) and evaluate js
 *
 *  MyConstructor may have _resourcePath property. Default value: '/res'
 *
 *  @todo implement loading config without constructing object
 *
 */
define(['jquery', 'Class'], function ($) {
    var loadMethods = {
        eval:'eval',
        json:'json'
    }

    var Loadable = {
        processingFiles:0,
        fileExt:'js',
        defaultMethod:loadMethods.eval,
        resourcePath:'/res',
        onError:function (o, path, error) {
            console.log('Error: Unable to load "' + path + '", additional data:', error);
        }
    }

    Function.prototype._resourcePath = Loadable.resourcePath;

    function _isDeferred(target) {
        return typeof target === 'object' && typeof target.promise === 'function';
    }

    Function.prototype.construct = function (target) {
        if (!target._class) {
            target._class = this;
        }
        return construct(target);
    }

    /**
     *
     * @param target
     *  Possible values:
     *  1) url of js/json file that contain configuration
     *  2) configuration object
     *  3) deferred object
     *  4) ready class instance
     * @return deferred
     */
    Function.prototype.create = function (target) {
        var deferred = $.Deferred();
        switch (typeof target) {
            case 'object':
                if (target instanceof this) {
                    deferred.resolve(target);
                } else if (_isDeferred(target)) {
                    return target.promise();
                } else {
                    deferred.resolve(this.construct(target));
                }
                break;
            case 'string':
//                var Me = this;
//                Loadable.load(target).done(function(data){
//                    deferred.resolve(Me.construct(data));
//                });
                return this.load(target);
                break;
            default:
                throw new Error('Wrong function arguents. Expecting object or string.');
        }
        return deferred.promise();
    }
    Function.prototype.createAll = function (targets, callback) {
        var wait = [];
        for (var i = targets.length; i--;) {
            wait.push(this.create(targets[i]).done(callback));
        }
        return $.when.apply($, wait).promise();
    }

    /**
     *
     * @param name
     * @param callback
     * @param dontConstruct
     * @return deferred
     *
     * @deprecated
     */
    Function.prototype.load = function (name, callback, dontConstruct) {

        Loadable.processingFiles++;

        var deferred = $.Deferred(),
            Me = this,
            _processAndConstruct = function (data) {
                var obj;
                if (typeof(data) == 'string') {
                    //try {
                        eval('data = ' + data);
//                    } catch (e) {
//                        throw new Error(
//                            'Can\'t evaluate data loaded from "' + name + '" (file path resolvas as "' + path + '"), data:'+data
//                        );
//                    }
                }
                if (dontConstruct) {
                    obj = data;
                } else {
                    // @todo fix bug on mapeditor on double call of construct(data) with DomImageLayer
                    obj = Me.construct(data);
                }
                if ((typeof(name) == 'string') || name instanceof String) obj.loadedFrom = name;
                deferred.resolve(obj);
                Loadable.processingFiles--;
            };

        if (callback instanceof Function) deferred.done(callback);
        // if first arg isn't file name
        if ((typeof(name) != 'string') && !(name instanceof String)) {
            if (name instanceof Me) {
                // first arg is not a name, it's ready class instance
                return deferred.resolve(name).promise()
            } else {
                //first arg is a configuration, we need to exec constructor
                _processAndConstruct(name);
                return deferred.promise();
            }

        }

        var path = (name[0] === '/') ? name : (this._resourcePath + '/' + name );

        var method;
        if (/\.js$/.test(name)) {
            method = loadMethods.eval;
        } else if (/\.json$/.test(name)) {
            method = loadMethods.json
        } else {
            method = Loadable.defaultMethod;
            if (Loadable.fileExt) {
                var ext = '.' + Loadable.fileExt;
                if (name.indexOf(ext) === -1) {
                    path += ext;
                }
            }

        }

        /* @todo check that jquery ajax cache enabled for $.getJson by default */
        var requestParams = {
            success:_processAndConstruct,
            error:function (obj, message) {
                Loadable.onError(obj, path, message)
            }
        }

        requestParams.dataType = (method == loadMethods.json) ? 'json' : 'text';
        $.ajax(path, requestParams);
        return deferred;
    };


    Loadable.load = function (name) {

        Loadable.processingFiles++;

        var deferred = $.Deferred(),
            process = function (data) {
                var data;
                if (typeof(data) === 'string') {
                    eval('data = ' + data);
                }
                deferred.resolve(data);
                Loadable.processingFiles--;
            };
        var path = (name[0] === '/') ? name : (this._resourcePath + '/' + name );
        var method;
        if (/\.js$/.test(name)) {
            method = loadMethods.eval;
        } else if (/\.json$/.test(name)) {
            method = loadMethods.json
        } else {
            method = Loadable.defaultMethod;
            if (Loadable.fileExt) {
                var ext = '.' + Loadable.fileExt;
                if (name.indexOf(ext) === -1) {
                    path += ext;
                }
            }

        }
        /* @todo check that jquery ajax cache enabled for $.getJson by default */
        var requestParams = {
            success:process,
            error:function (obj, message) {
                Loadable.onError(obj, path, message)
            }
        }
        requestParams.dataType = (method == loadMethods.json) ? 'json' : 'text';
        $.ajax(path, requestParams);
        return deferred;
    };

    return Loadable;

});