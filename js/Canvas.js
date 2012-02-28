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
        var e = document.createElement('canvas');

        e.setAttribute('width', this.size[0]);
        e.setAttribute('height', this.size[1]);
        if (config.elementId) {
            e.setAttribute('id', config.elementId);
        }
        e.setAttribute('style', 'position:absolute; top:0; left:0;');//tmp
        this.domElement = e;
        if (config.zIndex) {
            $(e).css('z-index', config.zIndex);
        }
        this.domContainer.appendChild(e);
        if (typeof G_vmlCanvasManager !== 'undefined') {
            this.domElement = G_vmlCanvasManager.initElement(this.domElement);
        }
        this.context = this.domElement.getContext("2d");
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
        clear:function () {
            this.context.clearRect(0, 0, this.size[0], this.size[1]);
        },
        destroy:function () {
            Canvas.instances.splice(this.id, 1);
        }
    }
    return Canvas;
});

