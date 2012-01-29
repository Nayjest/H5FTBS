define(['map/Map', 'AnimationManager', 'Class'], function (Map, AnimationManager, Class) {

    var defaults = {

    }

    /**
     *
     * @param config
     */
    Game = function (config) {
        merge(this, config);
        this.players = [];
        mergeUndefined(this, defaults);
        this.map = config.map instanceof Map ? config.map : Map.load(config.map);
        this.animationManager = new AnimationManager();
        this.map.game = this;
        if (config.players) {
            for (var i in config.players) {
                this.addPlayer(config.players[i]);
            }
        }
        //this.currentPlayer = this.players[0].id;
    }

    Game.prototype = {
        addPlayer:function (player) {
            player.connectToGame(this);
        },
        getPlayerById:function (id) {
            for (var i in this.players) {
                if (this.players[i].id == id) return this.players[i];
            }
        }

    }

    return Game;

});