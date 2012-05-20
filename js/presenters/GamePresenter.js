define(['presenters/PlayerPresenter', 'Class'],function(PlayerPresenter, OOP){
    function GamePresenter(game){
        this.game = game;
        game.on('setCurrentUnit',function(unit){
            unit.presenter.select();
        });
        game.on('addPlayer',function(player){
            if (!player.presenter) new PlayerPresenter(player);
        });
        for (var i = game.players.length;i--;){
            if (!game.players[i].presenter) new PlayerPresenter(game.players[i]);
        }
    }
    var Me = GamePresenter;
    GamePresenter.prototype = {

    }
    return GamePresenter;
});
