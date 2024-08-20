<?php
    if (isset($_REQUEST['data'])){
        $data = $_REQUEST['data'].PHP_EOL;
        file_put_contents('highScores.txt', $data);
    }
?>