define([], function () {
    return {
        rect:{
            /**
             *
             * @param [int x, int y] point
             */
            isPointInside:function (point) {
                var lp = this.getScreenPos();
                return (
                    (point[0] > lp[0])
                        && (point[0] < lp[0] + this.size[0])
                        && (point[1] > lp[1])
                        && (point[1] < lp[1] + this.size[1])
                    );

            }
        },
        circle:{
            /**
             *
             * @param [int x, int y] point
             */
            isPointInside:function (point) {
                var lp = this.getCenterScreenPos();
                var dist = Math.sqrt(
                    (point[0]-lp[0])*(point[0]-lp[0])+(point[1]-lp[1])*(point[1]-lp[1])
                );
                return dist < ((this.size[0]+this.size[1])/4)*.5//@todo temp!!
            }
        },
        gex:{

        }
    }
});
