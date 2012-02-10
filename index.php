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
                'jquery':'lib/jquery/jquery-1.7.1.min'
            },
            //only for dev mode to disable browser caching. if you need to add breakpoints in Chrome debug, disable it
            urlArgs:"bust=" + (new Date()).getTime()
        }
    </script>
    <script src="/js/lib/requirejs/require.js"></script>
    <script>
        window.main = '<?= empty($_GET)?'demo1':array_pop($_GET) ?>';
        require(['bootstrap']);
    </script>
</head>

<body id="body">

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
    <input type="button" value="Закончить ход" onclick="game.nextTurn();"><br>
    <input type="button" value="След. юнит" onclick="game.nextUnit();">

</div>

</body>

</html>
