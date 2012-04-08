define([], function () {
    "use strict";
    var
        me = {
            pos:[0, 0],
            keyPressed:[false, false, false],
            KEY_LEFT:0,
            KEY_MIDDLE:1,
            KEY_RIGHT:2,
            init:function (targetDomElement) {
                targetDomElement.onmousemove = _capturePosition;
                targetDomElement.onmousedown = _captureKeyPress;
                targetDomElement.onmouseup = _setKeysNotPressed;
            }

        },
        _capturePosition = function (e) {
            me.pos[0] = e.x;
            me.pos[1] = e.y;

        },
        _captureKeyPress = function (e) {
            me.keyPressed[e.button] = true;
        },
        _setKeysNotPressed = function (e) {
            me.keyPressed[0] = false;
            me.keyPressed[1] = false;
            me.keyPressed[2] = false;
        };
    return me;
});