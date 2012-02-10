/**
 *  module
 */
define(['layers/AbstractLayer', 'Loadable'], function (AbstractLayer) {

    var defaults = function () {
        return {
            ready:false

        }
    }
    var Me = function (config) {
        var options = config ? merge({}, config) : {};
        mergeUndefined(options, defaults());
        Me.superClass.call(this, options);
    }
    Me.inheritsFrom(AbstractLayer).extendProto({
        // Called when object loaded
        _doOnLoad:function () {
            var me = this;
            me.ready = true;
            for (var i = me._onLoad.length; i--;) {
                me._onLoad[i](me);
            }
        },
        onLoad:function (callback) {
                    if (!this.ready)
                        this._onLoad.push(callback);
                    else
                        callback(this);
                    return this;
        }

    });


    return AbstractImageLayer = Me;

});