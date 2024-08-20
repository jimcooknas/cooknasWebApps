<?php
$fname = "highScore.txt";//generates name
$file = fopen($fname, 'r');//creates new file
$data = fread($file, 1024);
fclose($file);
echo $data;
?>