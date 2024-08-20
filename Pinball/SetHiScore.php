<?php
$data = isset($_REQUEST['data']) ? $_REQUEST['data'] : NULL;
if($data != NULL){
	$fname = "highScore.txt";//generates name

	$file = fopen($fname, 'w');//creates new file
	fwrite($file, $data);
	fclose($file);
	echo $data;
}else{
	echo "No data";
}
?>