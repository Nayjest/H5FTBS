define(
    ['layers/DomLayer'], function (DomLayer) {
    function PlayerPresenter(player) {
        this.player = player;
        player.presenter = this;
    }

    var Me = PlayerPresenter;
    PlayerPresenter.prototype = {

        createUnitPlayerIcon:function () {
            var cellSize = this.player.game.map.cellSize;
            var layerConfig = {
                tag:'div',
                size:[4, 3],
                offset:[cellSize[0] / 2 - 10, -cellSize[1] / 2 + 10],
                css:{
                    backgroundColor:this.player.color,
                    // @todo MAP dosesn't loads. see: console.log('Map:',Map)
                    zIndex:100,
                    position:'absolute'

                }
            }
            return new DomLayer(layerConfig);
        },
        setPlayerIcon:function (unit) {
            this.createUnitPlayerIcon().setParent(unit.presenter.layer).update();
        }
    };

//    decorator.decorateAfter(Unit.prototype,'setPlayer', function(){
//        if (this.player instanceof Player && this.player.presenter instanceof PlayerPresenter) {
//            this.player.presenter.setPlayerIcon(this);
//        }
//    });

    return PlayerPresenter;
});
