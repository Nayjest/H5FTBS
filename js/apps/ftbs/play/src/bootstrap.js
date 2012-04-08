define(
    ['layers/canvas/CanvasLayer', 'tbsGame/TbsUnit', 'canvas/draw', 'decorator'],
    function (CanvasLayer, TbsUnit, draw, decorator) {
        //add shadows
        // @todo optimize shadows
        decorator.decorateAfter(TbsUnit.prototype, '_doOnLoad', function () {
            var shadow = new CanvasLayer({
                parent:this.layer,
                canvas:this.layer.canvas,
                offset:[0, ~~(this.layer.size[1] * .5)],
                drawMethod:function () {
                    var offset = this.getAbsoluteOffset();
                    var w = this.size[0] * .7;
                    var h = this.size[1] * .7;
                    var x = offset[0] - w / 2;
                    var y = offset[1] - h / 2;

                    this.ctx.translate(x, y);
                    this.ctx.scale(1, 0.5);
                    draw.shadow(this.ctx, 0, 0, w, h);
                    this.ctx.scale(1, 2);
                    this.ctx.translate(-x, -y);
                }
            });
        });

    });
