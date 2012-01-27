<!DOCTYPE HTML>
<html>
    <head>
        <title>Canvas test</title>		
        <link rel="stylesheet" type="text/css" href="/css/main.css">
        <?php // <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script> ?>
        <!--[if IE]>
        <script type="text/javascript" src="js/lib/excanvas/excanvas.compiled.js"></script>
        <![endif]-->
        <script>
        //configure loader
        var require = {
            baseUrl:'/js',            
            paths:{
                'jquery':'lib/jquery/jquery-1.7.1.min',
            },
            //only for dev mode
            urlArgs: "bust=" +  (new Date()).getTime(),
        }
        </script>
        <script src="/js/lib/requirejs/require.js"></script>
        <script>
            require(['bootstrap']);
        </script>
        <?/*
        <script src="/js/Class.js"></script>
        <script src="/js/Node.js"></script> 
        <script src="/js/layers/AbstractLayer.js"></script>
        <script src="/js/layers/DomLayer.js"></script>                
        
        <script src="/js/layers/components/Tool.js"></script>
        <script src="/js/layers/components/Highlight.js"></script>
        
        <script src="/js/map/MapCell.js"></script>                                
        <script src="/js/map/Map.js"></script>
        <script src="/js/map/MapGenerator.js"></script>                                
        <script src="/js/map/gex/Gex.js"></script>                                
        <script src="/js/map/MapObject.js"></script>
        <script src="/js/map/Unit.js"></script>
        <script src="/js/tbsGame/TbsUnit.js"></script>                                                                                                                                
        <script src="/js/utils.js"></script>                                
        <script src="/js/AnimationManager.js"></script>
        <script src="/js/Game.js"></script>
        <script src="/js/TurnBasedGame.js"></script>                                                                
        <script src="/js/Player.js"></script>                                

        <script src="/js/bootstrap.js"></script>    
        */?>
        <style>
            div{
                padding:0;
                margin:0;
            }
            .highlighted{
                outline:1px solid white;
            }
            #sidebar{
                position:absolute;
                right:0;
                top:0;
                height: 100%;
                background-color: #CCC;
                width:200px;
                z-index: 999999;

            }
        </style>
    </head>

    <body>	
        <div id="area"></div>
        <div id="sidebar">
            <div>
                Ходит
                <span id="playerInfo">

                </span>
            </div>
            <div>

                <span id="mapInfo">

                </span>
            </div>
            <input type="button" value="След.ход" onclick="game.nextTurn();">
            <input type="button" value="След. юнит" onclick="game.nextUnit();">

        </div>

    </body>

</html>
