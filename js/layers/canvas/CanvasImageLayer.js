/**
 *  module CanvasImageLayer
 */
define(['layers/canvas/CanvasLayer', 'jquery' , 'Loadable'], function (CanvasLayer, $) {

    // radians in one degree
    var radInDeg = Math.PI / 180;
    var Me, CanvasImageLayer;
    Me = CanvasImageLayer = function (config) {
        var me = this;
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Me.superClass.call(this, options);
        this.setImage(options.image);
    }
    Me.fit = {
        SCALE:0,
        /** image should be scaled to be as large as possible while ensuring both its dimensions are less than
         *  or equal to the corresponding properties of object
         */
        FIT:1,
        /** synonym to fit */
        CONTAIN:1,
        /**
         *  image should be scaled to be as small as possible while ensuring both its dimensions are greater than
         *  or equal to the corresponding properties of object
         */
        COVER:2,
        /** original image size */
        ORIGINAL:3
    }
    var defaults = {
        image:null,
        fit:Me.fit.SCALE,
        ready:false,
        drawMethod:function () {
            if (!this.ready) return;
            var ctx = this.ctx;
            var offset = this.getAbsoluteOffset();
            //@todo move all this to setSize
            switch (this.fit) {
                case Me.fit.SCALE:
                    ctx.drawImage(this.image, offset[0] - this._w, offset[1] - this._h, this.size[0], this.size[1]);
                    break;
                case Me.fit.FIT:
                    ctx.drawImage(this.image, offset[0] - this._w, offset[1] - this._h, this._w*2, this._h*2);
                    break;
                case Me.fit.COVER:
                    throw Error('Not implemented yet');//@todo
                    break;
                case Me.fit.ORIGINAL:
                    ctx.drawImage(this.image, offset[0] - ~~(this.image.width/2), offset[1] - ~~(this.image.height/2), this.image.width, this.image.height);
                    break;
                default:
                    throw new Error('Unsupported image fit mode.');
            }

        }
    }
    Me.inheritsFrom(CanvasLayer).extendProto({
        onLoad:function (callback) {
            this.loaded.done(callback);
            return this;
        },
        setImage:function (image) {
            var me = this;
            var deferred = $.Deferred();
            me.loaded = deferred.promise();
            deferred.done(function () {
                me.ready = true;
                // to recalculate sizes according to fit
                me.setSize(me.size);
            });
            var _addLoadHandler = function (img) {
                $(img).on('load', function () {
                    deferred.resolve();
                });
            }
            if (typeof(image) === 'string') {
                me.image = new Image();
                me.image.src = image;
                _addLoadHandler(me.image);
            } else if (image instanceof Image) { //@todo check Image.complete
                me.image = Image;
                if (!image.complete) {
                    _addLoadHandler(img);
                } else {
                    deffered.resolve();
                }
            } else {
                throw new Error('Unsupported image type');
            }
            return this;
        },
        // func for interface compatibility with DomLayer
        setFit:function (fit) {
            this.fit = fit;
            // to recalculate sizes according to fit
            this.setSize(this.size);
        },
        /**
         *
         * @param [int,int] size
         */
        setSize:function (size) {
            if (this.ready) switch (this.fit) {
                case Me.fit.ORIGINAL:
                    break;
                case Me.fit.COVER:
                    throw Error('Not implemented yet');
                    //@todo
                    break;
                case Me.fit.FIT:
                    if (this.image.width / this.image.height > size[0] / size[1]) {
                        this._w = ~~(size[0] / 2);
                        this._h = ~~(size[0] / this.image.width * this.image.height / 2);
                    } else {
                        this._w = ~~(this.image.width / size[0] * size[1] / 2);
                        this._h = ~~(size[1] / 2);
                    }
                    break;
                case Me.fit.SCALE:
                    this._w = ~~(size[0] / 2);
                    this._h = ~~(size[1] / 2);
                    break;
                default:
                    throw Error('Not supported fit type');

            }
            Me.superProto.setSize.call(this, size);
        }
    });

    return CanvasImageLayer;
});