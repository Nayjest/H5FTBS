/**
 * Javascript decorator.
 * Usage examples:
 * <code>
 * var decorator = require('path/to/libs/decorator');
 * decorator.decorateBefore(
 *     MyClass.prototype,
 *     'methodName',
 *     function(){
 *         console.log('methodName call!');
 *     }
 * );
 * </code>
 *
 * @author Vitaliy [Nayjest] Stepanenko <mail@vitaliy.in>
 */
define([], function () {
    "use strict";
    //Best way to get global object (window in browser) in strict mode
    var FN = Function, glob = FN('return this')();

    function decorateBefore(target, decorator) {
        var fn = function () {
            decorator.apply(this, arguments);
            return target.apply(this, arguments);
        };
        fn.prototype = target.prototype;
        return fn;
    }

    function decorateAfter(target, decorator) {
        var fn = function () {
            var res = target.apply(this, arguments);
            decorator.apply(this, arguments);
            return res;
        };
        fn.prototype = target.prototype;
        return fn;
    }

    function decorateMethod(obj, methodName, decorator, insertAfter) {
        var decorate = insertAfter ? decorateAfter : decorateBefore;
        return obj[methodName] = decorate(obj[methodName], decorator);
    }


    var decorator = {
        /**
         * Decorate function, decorator runs after function call.
         * Usage:
         *  decorateAfter(<Object targetObj>,<String methodName>,<Function decorator>)
         *  decorateAfter(<Function targetFunc>, <function decorator>)
         *  decorateAfter(<String funcName>, <function decorator>)
         *
         * @param Object|Function|String arg1
         * @param String|Function arg2
         * @param Function|undefined arg3
         * @return Function decorated function.
         */
        decorateAfter:function (arg1, arg2, arg3) {
            switch (typeof arg1) {
                case 'object':
                    return decorateMethod(arg1, arg2, arg3, true);
                case 'function':
                    return decorateAfter(arg1, arg2);
                case 'string':
                    return decorateMethod(glob, arg1, arg2, true);
            }
        },
        decorateBefore:function (arg1, arg2, arg3) {
            switch (typeof arg1) {
                case 'object':
                    return decorateMethod(arg1, arg2, arg3, false);
                case 'function':
                    return decorateBefore(arg1, arg2);
                case 'string':
                    return decorateMethod(glob, arg1, arg2, false);
            }
        },
        removeDecorators:function (arg1, arg2, arg3) {
            switch (typeof arg1) {
                case 'object':
                    return arg1[arg2] = arg1[arg2].prototype.constructor;
                case 'function':
                    return arg1.prototype.constructor;
                case 'string':
                    return glob[arg1] = glob[arg1].prototype.constructor;
            }
        }
    }
    decorator.decorate = decorator.decorateBefore;
    return decorator;
});
