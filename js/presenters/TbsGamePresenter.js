define(['presenters/GamePresenter'],function(GamePresenter){
    function TbsGamePresenter(game){
        Me.superClass.call(this,game);
    }
    var Me = TbsGamePresenter;
    Me.inheritsFrom(GamePresenter);
    Me.extendProto({

    });
    return TbsGamePresenter;
});
