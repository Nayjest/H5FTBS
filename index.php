<!DOCTYPE HTML>
<!-- appcache manifest for offline work @todo finish manifest -->
<html  manifest="/h5game.manifest">
<head>
    <title>Canvas test</title>
    <!-- This will make the page be displayed properly on iphone and android devices. -->
    <!--
    @todo errors in chrome
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
    -->

    <!--
    Icon for iPhone/Android (png, 57x57)
    <link rel="apple-touch-icon" href="/customIcon.png"/>
    -->

    <link rel="stylesheet" type="text/css" href="/css/main.css">
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
