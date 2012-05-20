define(['widgets/TplWidget', 'decorator', 'jquery'], function (TplWidget, decorator, $) {
    "use strict";
    var Sidebar = function (config) {
        Me.superClass.call(this, config);
        this.game = config.game;
        decorator.decorateAfter(this.game, 'setCurrentPlayer', this.updatePlayerInfo.bind(this));
        this.htmlReady.done(function(){
            this.$playerInfo = $('#playerInfo');
            this.game.ready.done(function(){
                this.updatePlayerInfo();
                $('.btnNextTurn').click(this.game.nextTurn.bind(this.game));
                $('.btnNextUnit').click(this.game.nextUnit.bind(this.game));
            }.bind(this));
        }.bind(this));
    }
    var Me = Sidebar;
    Me.inheritsFrom(TplWidget);
    Me.extendProto({
        tplSrc:'/js/widgets/sidebar/sidebar.tpl',
        updatePlayerInfo:function () {
            this.$playerInfo.html(this.game.currentPlayer.name);
        },
        destroy:function(){
            //@todo problem if some other classes creates decorators here
            // possible solution on decorator side: named decorators
            decorator.removeDecorators(this.game, 'setCurrentPlayer');
            Me.superProto.destroy.call(this);
        }
    });
    return Me;
});