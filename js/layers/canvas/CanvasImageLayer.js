/**
 *  module CanvasImageLayer
 */
define(['layers/canvas/CanvasLayer', 'Loadable'], function (CanvasLayer) {

    // radians in one degree
    var radInDeg = Math.PI / 180;

    var defaults = {
        image:'',
        ready:false,
        drawMethod:function () {
            var ctx = this.ctx;
            var offset = this.getAbsoluteOffset();
            console.log('offset:',offset);
            ctx.drawImage(this.image, offset[0], offset[1], this.size[0], this.size[1]);
        }
    }

    var Me = function (config) {
        var me = this;
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
        this._onLoad = [function(){me.update()}];
        this.setImage(options.image);
    }
    Me.inheritsFrom(CanvasLayer).extendProto({
        draw:function () {
            if (this.ready && this.visible) this.drawMethod.call(this);
        },
        _doOnLoad:function(){
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
        },
        setImage:function (image) {
            var me = this;
            if (typeof(image) === 'string') {
                me.image = new Image();
                me.image.src = image;
                me.image.onload = function () {
                    me._doOnLoad();
                };
            } else if (image instanceof Image) { //@todo check Image.complete
                me.image = Image;
                me.ready = true;
            } else {
                throw new Error('Unsupported image type');
            }
            return this;
        }
    });


    return CanvasImageLayer = Me;

});