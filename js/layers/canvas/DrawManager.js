/**
 * Implements delayed batch drawing with support of zIndex
 */
define(['layers/canvas/CanvasLayer', 'Canvas'], function (CanvasLayer, Canvas) {

    var _canvasesToRedraw = {},
        undefined;

    var drawList = new (function () {

        var _canvases = [];

        /**
         * Add layer to draw lis
         *
         * @param CanvasLayer layer
         */
        this.add = function (layer) {
            if (!layer.canvas) {
                return;
            }
            var canvasId = layer.canvas.id,
                layers;
            // if no such canvas draw list, create it
            if (_canvases[canvasId] === undefined || _canvases[canvasId].length === 0) {
                _canvases[canvasId] = [layer];
                return;
            }
            layers = _canvases[canvasId];
            if (layers.indexOf(layer) === -1) {
                for (var i = layers.length - 1; i >= 0; i--) {
                    if (layers[i].zIndex >= layer.zIndex) {
                        i++;
                        break;
                    }
                }
                //insert layer at [i] position
                layers.splice(i,0,layer);
            }
        }

        /**
         * Remove layer from draw list for canvas
         *
         * @param CanvasLayer layer
         */
        this.remove = function (layer) {
            if (!layer.canvas) {
                return;
            }
            var canvasId = layer.canvas.id,
                canvasList = _canvases[canvasId],
                index;

            if (canvasList && (index = canvasList.indexOf(layer)) !== -1) {
                canvasList.splice(index, 1);
            }
        }

        /**
         * Draw all layers on canvas
          * @param int canvasId
         */
        this.draw = function(canvasId) {
            if (Canvas.instances[canvasId]) {
                Canvas.instances[canvasId].clear();
            } else {
                console.log('Warning: wrong canvasId: ', canvasId);
            }
            var canvasList = _canvases[canvasId];
            if (!canvasList || canvasList.length === 0) {
                return;
            }
            for (var i = canvasList.length;i--;) {
                if (canvasList[i].visible) {
                    canvasList[i].drawMethod();
                }
            }
        }

    });

    function mutateCanvasLayer() {
        var _setCanvas = CanvasLayer.prototype.setCanvas,
            _destroy = CanvasLayer.prototype.destroy,
            _setZIndex = CanvasLayer.prototype.setZIndex;

        CanvasLayer.prototype.draw = function () {
            if (this.visible) {
                _canvasesToRedraw[this.canvas.id] = true;
            }
        }

        /**
         *
          * @param int zIndex
         */
        CanvasLayer.prototype.setZIndex = function(zIndex) {
            _setZIndex.call(this,zIndex)
            drawList.remove(this);
            drawList.add(this);
            return this;
        }

        /**
         *
         * @param Canvas canvasObject
         */
        CanvasLayer.prototype.setCanvas = function (canvasObject) {
            if (this.canvas) {
                if (this.canvas !== canvasObject) {
                    drawList.remove(this);
                }
            }
            _setCanvas.call(this, canvasObject);
            drawList.add(this);
            return this;
        }

        CanvasLayer.prototype.destroy = function () {
            drawList.remove(this);
            return _destroy.call(this);
        }
    }

    function compareZIndex(a, b) {
        return a.zIndex - b.zIndex;
    }

    function redraw() {
        for (var i in _canvasesToRedraw) {
            if (_canvasesToRedraw.hasOwnProperty(i) && _canvasesToRedraw[i]) {
                drawList.draw(i);
                _canvasesToRedraw[i] = false;

            }
        }
    }

    function startLoop() {
        setInterval(redraw, 30);
    }

    var DrawManager = {
        init:function () {
            mutateCanvasLayer();
            startLoop();
        }
    }
    DrawManager.init();
    return DrawManager;

});
