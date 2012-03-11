/**
 * Animation Manager class
 */
define(['jquery','Class'], function ($) {

    var defaults = {
        delay:30,
        speed:4
    }

    AnimationManager = function (config) {
        if (!config) config = {};
        if (config) mergeUndefined(this, config);
        mergeUndefined(this, defaults);

    }

    AnimationManager.prototype = {
        move:function (layer, targetOffset, speed) {
            var delay = this.delay,
                speed = this.speed,
                intervalId,
                offset = layer.offset,
                finished = false,
                x,y,
                targetX = targetOffset[0],
                targetY = targetOffset[1],
                deferred = $.Deferred(),
                doMove = function () {
                    finished = false,
                    x = offset[0];
                    y = offset[1];
                    if (x < targetX - speed) {
                        offset[0]+=speed;
                    } else if (x > targetX + speed) {
                        offset[0]-=speed;
                    } else {
                        finished = true;
                    }

                    if (y < targetY - speed) {
                        offset[1]+=speed;
                    } else if (y > targetY + speed) {
                        offset[1]-=speed;
                    } else {
                        if (finished) {
                            layer.update();
                            deferred.resolve();
                            clearInterval(intervalId);
                        }
                    }
                    layer.update();
                }
            intervalId = setInterval(doMove, delay);
            return deferred.promise();
        }
    }

    return AnimationManager;
});