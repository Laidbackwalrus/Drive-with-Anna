<?php
// global file
require "config.php";

// get detilas 
$weekStart = intval($_GET['wS']);
$monthStart = intval($_GET['mS']);
$yearStart = intval($_GET['yS']);

$weekEnd = intval($_GET['wE']);
$monthEnd = intval($_GET['mE']);
$yearEnd = intval($_GET['yE']);

$startHour = 7;
$endHour = 19;

$from = strval("{$yearStart}/{$monthStart}/{$weekStart} 00:00:00");
$to = strval("{$yearEnd}/{$monthEnd}/{$weekEnd} 23:00:00");


$sql = "SELECT length, startTimeWork FROM working_hours WHERE 
startTimeWork BETWEEN ? AND ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $from, $to);
$stmt->execute();
$results = $stmt->get_result();

if($results->num_rows>0){
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");

    $schedule = $xml->createElement("schedule");
    $xml->appendChild($schedule);
    
    $slots = $xml->createElement("workingHours");
    $schedule->appendChild($slots);
    while($row=mysqli_fetch_array($results)){
        $slot=$xml->createElement("slot");
        $slots->appendChild($slot);
         
        $length=$xml->createElement("length", $row['length']);
        $slot->appendChild($length);

        $startTimeWork=$xml->createElement("startTimeWork", $row['startTimeWork']);
        $slot->appendChild($startTimeWork);
    }

    $sql = "SELECT length, startTime FROM lessons WHERE 
    startTime BETWEEN ? AND ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $from, $to);
    $stmt->execute();
    $results = $stmt->get_result();
    
    if($results->num_rows>0){
        $slots = $xml->createElement("lessons");
        $schedule->appendChild($slots);
        while($row=mysqli_fetch_array($results)){
            $slot=$xml->createElement("slot");
            $slots->appendChild($slot);
             
            $length=$xml->createElement("length", $row['length']);
            $slot->appendChild($length);
    
            $startTime=$xml->createElement("startTime", $row['startTime']);
            $slot->appendChild($startTime);
        }
    }

    echo $xml->saveXML();
    $xml->save("report.xml");
} else {
    echo "False";
}
?>