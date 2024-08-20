<?php
    $out = array();
    foreach (glob('files/*.*') as $filename) {
        $p = pathinfo($filename);
        $out[] = $p['filename'].'.'.$p['extension'];
    }
    echo 'callback(' . json_encode($out) . ')';
?>