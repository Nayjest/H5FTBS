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
                'jquery.tmpl':'lib/jquery-tmpl/jquery.tmpl.min'
            },
            //only for dev mode to disable browser caching. if you need to add breakpoints in Chrome debug, disable it
            // @todo This makes js files unreachable in ie developers toolbar
            urlArgs:"bust=" + (new Date()).getTime()
        }
    </script>
    <script data-main="bootstrap" src="/js/lib/requirejs/require.js"></script>
</head>
<body id="body">
</body>
</html>
