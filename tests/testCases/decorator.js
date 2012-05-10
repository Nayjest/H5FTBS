define(['decorator'], function (decorator) {
    return function () {
        module('decorator');

        test('<function>, <function>', function () {
            var decLog = '';
            var origF = function (arg1) {
                decLog = decLog + '[orig]' + (arg1 ? arg1 : '');
                return arg1;
            };
            var origBeforeDec = function (arg1) {
                decLog = decLog + '[before]' + (arg1 ? arg1 : '');
            };
            var origAfterDec = function (arg1) {
                decLog = decLog + '[after]' + (arg1 ? arg1 : '');
            };

            var f = origF;
            decorator.decorateBefore(f, origBeforeDec)();
            equal(decLog, '[before][orig]', 'prepend decorator called');

            decLog = '';
            decorator.decorateAfter(f, origAfterDec)();
            equal(decLog, '[orig][after]', 'append decorator called');

            decLog = '';
            decorator.decorateBefore(f, f)('arg');
            equal(decLog, '[orig]arg[orig]arg', 'decorated by itself');

            decLog = '';
            f('arg1');
            equal(decLog, '[orig]arg1', 'original function does not changed');

            decLog = '';
            f = decorator.decorateAfter(f, origAfterDec);
            f = decorator.decorateAfter(f, origAfterDec);
            f = decorator.decorateBefore(f, origBeforeDec);
            f = decorator.decorateBefore(f, f);
            f = decorator.decorateAfter(f, origAfterDec);
            f();

            equal(
                decLog,
                '[before][orig][after][after][before][orig][after][after][after]',
                'complex decorator combination'
            );
            decLog = '';
            f('+');
            equal(
                decLog,
                '[before]+[orig]+[after]+[after]+[before]+[orig]+[after]+[after]+[after]+',
                'arguments passed to decorator'
            );

        });


        test('<object target>, <string methodName>, <function decorator>', function () {
            var orig = function () {
                this.writeProp++;
                return this.readProp - 1;
            };
            var obj = {
                readProp:3,
                writeProp:4,
                method1:orig,
                method2:function () {
                }
            }
            var testDecorator = function (arg) {
                this.writeProp += (arg ? arg : 1);
            }
            decorator.decorateAfter(obj, 'method1', testDecorator);
            equal(obj.method1(), 2, 'method returned correct value');
            equal(obj.writeProp, 6, 'this passed correctly');
            obj.method1(4);
            equal(obj.writeProp, 11, 'arguments used in decorator');
            var inst = new obj.method1();
            ok(inst instanceof obj.method1, 'instanceof check 1');
            ok(inst instanceof orig, 'instanceof check 2');
            ok(!(inst instanceof obj.method2), 'instanceof check 3');
        });

    }
})
