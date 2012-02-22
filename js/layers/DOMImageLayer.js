/**
 *  module DomImageLayer
 */
define(['layers/DomLayer', 'Loadable'], function (DomLayer) {

    var defaults = function () {
        return {
            image:null,
            fit:Me.fit.SCALE,
            ready:false,
            css:{},
            attr:{}
        }
    }

    var DomImageLayer = function (config) {
        var options = defaults();
        if (!config) config = {};
        merge(options, config);
        mergeUndefined(options.css, {
            zIndex:99999,
            position:'absolute',
            border:'none',
            outline:'none',
            backgroundRepeat:'no-repeat'
        });
        if (options.attr['class'] === undefined) options.attr['class'] = 'noselect';
        Me.superClass.call(this, options);
        this.setFit(options.fit);
        this.setImage(options.image);
    }
    var Me = DomImageLayer.inheritsFrom(DomLayer).extendProto({
        /**
         * Adds callback for image load event.
         * Callback will executed immediately if image was loaded before setting it.
         * @param Function callback
         */
        onLoad:function (callback) {
            this.loaded.done(callback);
            return this;
        },
        /**
         * Set fit mode
         * Use only after parent constructor call
         * @param fit use constants from Me.fit
         * @link Me.fit
         */
        setFit:function (fit) {
            if (!_fitCss[fit]) throw new Error('Unsupported DomImageLayer fit type.');
            this.$el.css({backgroundSize:_fitCss[fit]});
            if (fit==Me.fit.COVER) {
                this.$el.css({backgroundRepeat:'repeat'});
            }
            this.fit = fit;
        },
        /**
         *
         * @param Image|string image Image object or image url
         */
        setImage:function (image) {
            var me = this,
                url,
                deferred = $.Deferred(),
                finalize = function () {
                    me.$el.css('background-image', 'url(' + url + ')');
                    me.ready = true;
                    me.update();
                    deferred.resolve(me);
                };
            me.loaded = deferred.promise();
            if (typeof(image) === 'string') {
                url = image;
            } else if (image instanceof Image) { //@todo check Image.complete
                url = image.src;
            } else {
                throw new Error('Unsupported image type:' + console.log(image));
            }
            if (Me.useImageLoadedCheck) {
                img = new Image();
                img.src = url;
                img.onload = finalize;
            }
            else finalize();
            return this;
        }

    });

    /**
     * If set to true, will create Image element to check when it loaded,
     * If set to false, (new DomImageLayer(config)).loaded.done(callback) will execute callback immediately,
     * But it will increase performance and save memory
     */
    Me.useImageLoadedCheck = false;

    /**
     * @var Me.fit List of possible fit modes.
     * Use in setFit(mode) method
     */
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
    /**
     * @var Array _fitCss Values of background-size css property according to ImageLayer fit mode
     */
    var _fitCss = [];
    _fitCss[Me.fit.SCALE] = '100% 100%';
    _fitCss[Me.fit.COVER] = 'cover';
    _fitCss[Me.fit.CONTAIN] = 'contain';
    _fitCss[Me.fit.ORIGINAL] = 'auto auto';



    return Me;
});