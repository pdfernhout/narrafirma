<?php

// Making a function to create canonical JSON

function copyObjectWithSortedKeys($value) {
    if (is_array($value)) {
        return array_map("copyObjectWithSortedKeys", $value);
    } else if (is_object($value)) {
        $valueCopyWithSortedKeys = array();

        foreach ($value as $key => $value) {
    		$valueCopyWithSortedKeys[$key] = copyObjectWithSortedKeys($value);
		}
        
        ksort($valueCopyWithSortedKeys);

        return $valueCopyWithSortedKeys;
    
    } else {
        return $value;
    }
}


$json1 = array(
  "b" => 1,
  "q" => 2,
  "a" => 3,
  "z" => 4
);

$json2 = new stdClass();

$json2->b = 1;
$json2->q = 2;
$json2->a = 3;
$json2->z = 4;

$json2->z = new stdClass();
$json2->z->h = 10;
$json2->z->q = 20;
$json2->z->a = 30;

// $sortedJson = $json;
// ksort($sortedJson);

$sortedJson = copyObjectWithSortedKeys($json2);

echo json_encode($json);

echo "\n===============\n";

echo json_encode($sortedJson);

echo "\n";
