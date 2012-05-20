define(['map/MapObject', 'utils', 'Player', 'Class'], function (MapObject, utils, Player, OOP) {

    var defaults = {
        player:null,
        type:'Default unit',
        killedUnits:[]
    };

    function Unit (config) {
        var options = merge({}, config);
        mergeUndefined(options, defaults);
        Unit.superClass.call(this, options);
        //config.player && this.setPlayer(config.player);
    };
    var Me = Unit;
    Me.inheritsFrom(MapObject).extendProto({
        presenterClass:'presenters/UnitPresenter',
        kill:function (enemyUnit) {
            console.log(this,'killed',enemyUnit);
            this.killedUnits.push(enemyUnit);
            this.player.killedUnits.push(enemyUnit);
            enemyUnit.die();
        },
        placeTo:function (map, x, y) {
            Me.superProto.placeTo.call(this, map, x, y);
            map.units.push(this);
            return this;
        },
        die:function () {
            console.log(this,'died');
            this.player.casualties.push(this);
            this.setPlayer(null);
            this.destroy();

        },

        /**
         * @param Player player
         */
        setPlayer:function (player) {
            if (this.player instanceof Player) {
                utils.removeFromArray(this, this.player.units);
            }
            this.player = player;
            if (player instanceof Player) {
                player.units.push(this);
            }
            return this;
        }


    });

    return Unit;

});