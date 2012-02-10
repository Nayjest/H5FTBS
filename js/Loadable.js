/**
 *  Module Loadable
 *  Extends function prototype by adding possibility to load objects from JSON or JS files.
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
        onError:function (o, path, error) {
            console.log('Error: Unable to load "' + path + '", additional data:', error);
        }
    }

    Function.prototype._resourcePath = '/res';

    Function.prototype.load = function (name, callback) {

        Loadable.processingFiles++;

        var deferred = $.Deferred();
        if (callback instanceof Function) deferred.done(callback);

        var Me = this;
        var _processAndConstruct = function (data) {
            if (typeof(data) == 'string') {
                eval('data = ' + data);
            }
            if (!data._class) data._class = Me;
            deferred.resolve(construct(data));
            Loadable.processingFiles--;
        };

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

        requestParams.dataType = (method == loadMethods.json)?'json':'text';
        $.ajax(path, requestParams);
        return deferred;
    };

    return Loadable;

});