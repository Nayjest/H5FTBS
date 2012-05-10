<?php
$fileName = $_POST['fileName'];
if (!$fileName) {
    $fileName = time().'_'.rand(1000,9999);
}
$data = $_POST['data'];
file_put_contents(__DIR__ . '/../userFiles/maps/' . $fileName . '.js', $data);
echo json_encode(array(
    'status' => 1,
    'message' => 'Map has been saved successfully.',
));
