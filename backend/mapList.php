<?php
$basePath = dirmane(__DIR__);
$files = glob($basePath.'/userFiles/maps/*.js');
foreach($files as &$file) {
    $file = str_replace($basePath,'',$file);
}
$res = json_encode($files);
echo $res;