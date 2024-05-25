<?php
// connnect to database
require "config.php";

// get attached data
$slotTime = intval($_GET['sT']) - 3600; // unicode timestamp is 1 hour ahead
$mode = intval($_GET['m']);

// find slot time
$slotTime = Date("Y-m-d H:i:s", $slotTime);
// echo $slotTime;

// check mode
if ($mode == 0){
    // add record
    $sql = "INSERT INTO working_slots (time)
    VALUES (?);";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $slotTime);
    $stmt->execute();
} else {
    // delete record
    $sql = "DELETE FROM working_slots
    WHERE time = ?;";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $slotTime);
    $stmt->execute();
}
?>