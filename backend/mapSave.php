<?php
$fileName = $_POST['fileName'];
$data = $_POST['data'];
file_put_contents($fileName,$data);
echo json_encode(array(
    'status' => 1,
    'message' => 'Map has been saved successfully.',
));
