define(['map/Map', 'Class', 'EventDispatcher'], function (Map, OOP, EventDispatcher) {

    /**
     *
     * @param config
     */
    function Game (config) {
        this.ready = $.Deferred();
        this.players = [];
        this.mapReady = $.Deferred().done(function (map) {
            if (config.players) {
                for (var i = config.players.length; i--;) {
                    this.addPlayer(config.players[i]);
                }
            }
            map.attachPlayers(this.players);
            this.ready.resolve(this);
        }.bind(this));
        Map.create(config.map).done(function (map) {
            map.game = this;
            this.map = map;
            this.map.ready.done(function (map) {
                this.mapReady.resolve(map);
            }.bind(this));
        }.bind(this));
    }
    Game.inheritsFrom(EventDispatcher);
    Game.extendProto({
        addPlayer:function (player) {
            player.connectToGame(this);
        },
        getPlayerById:function (id) {
            for (var i = this.players.length; i--;) {
                if (this.players[i].id == id) return this.players[i];
            }
        }
    });
    return Game;

});
