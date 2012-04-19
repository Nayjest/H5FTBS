/**
 * Module for managing canvases
 */
define(['jquery'], function ($) {
    "use strict";
    //Get global object (window in browser) in strict mode
    var FN = Function, glob = FN('return this')();


    /**
     *    Canvas constructor
     */
    function Canvas(config) {
        if (!config) {
            config = {};
        }
        this.size = config.size ? config.size.slice(0) : [$('body').width(), $('body').height()];
        this.domContainer = config.containerSelector ? $(config.containerSelector).get(0) : $('body').get(0);
        this._createDomElement();
        if (config.elementId) {
            this.domElement.setAttribute('id', config.elementId);
        }
        if (config.zIndex) {
            $(this.domElement).css('z-index', config.zIndex);
        }
        if (typeof G_vmlCanvasManager !== 'undefined') {
            this.domElement = G_vmlCanvasManager.initElement(this.domElement);
        }
        this.context = this.domElement.getContext(Canvas.contextName);
        if (config.name) {
            this.name = config.name;
        }
        this.id = Canvas.instances.length;
        Canvas.instances.push(this);
    }

    /**
     * Get default canvas
     */
    Canvas.getDefault = function () {
        if (glob.canvas) return glob.canvas;
        return glob.canvas = new Canvas();
    }

    Canvas.contextName = '2d';


    /**
     *
     * @param String name
     * @param null|Object autocreate
     */
    Canvas.getByName = function (name, autocreateConfig) {
        var instances = Canvas.instances;
        for (var i = instances.length; i--;) {
            if (instances[i].name === name) {
                return instances[i];
            }
        }
        if (autocreateConfig) {
            if (typeof(autocreateConfig) !== 'object') {
                autocreateConfig = {};
            }
            autocreateConfig.name = name;
            return new Canvas(autocreateConfig);
        }
    }

    Canvas.instances = [];

    Canvas.prototype = {
        _createDomElement:function () {
            var e = document.createElement('canvas');
            e.setAttribute('width', this.size[0]);
            e.setAttribute('height', this.size[1]);
            e.setAttribute('style', 'position:absolute; top:0; left:0;');//tmp
            this.domContainer.appendChild(e);
            this.domElement = e;

        },
        clear:function () {
            this.context.clearRect(0, 0, this.size[0], this.size[1]);
        },
        destroy:function () {
            Canvas.instances.splice(this.id, 1);
        }
    }
    return Canvas;
});

