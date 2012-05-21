define(['davis'],function(Davis){
    /**
     *
     * @param {Array}routes Route format: [<string route>,<function action(req)>]
     * @constructor
     */
    function App(routes){
        this.davis = Davis(function(){
            for (var i = routes.length;i--;) {
                this.get(routes[i][0], routes[i][1]);
            }
        });
    }
    var Me = App;
    App.prototype = {
        start:function(){
            this.davis.start();
        }
    }

})
