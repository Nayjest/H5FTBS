define([], function () {


    /**
     *    Canvas constructor
     */
    function Canvas(params) {
        for (i in params) {
            this[i] = params[i];
        }
        this.domContainer = document.getElementById(params.containerId);
        var e = document.createElement('canvas');

        e.setAttribute('width', params.size[0]);
        e.setAttribute('height', params.size[1]);
        e.setAttribute('id', params.id);
        e.setAttribute('style', 'position:absolute; top:0; left:0;');//tmp
        this.domElement = e;
        this.domContainer.appendChild(e);
        if (typeof G_vmlCanvasManager != 'undefined') {
            this.domElement = G_vmlCanvasManager.initElement(c.domElement);
        }
        this.context = this.domElement.getContext("2d");
        Canvas.instances.push(this);
    }
    Canvas.instances = [];

    Canvas.prototype = {
        clear:function () {
            this.context.clearRect(0, 0, this.size[0], this.size[1]);
        }
    }
    return Canvas;
});

