<?php
// global file
require "config.php";

// get data from global variables
$weekStart = intval($_GET['wS']);
$monthStart = intval($_GET['mS']);
$yearStart = intval($_GET['yS']);
$weekEnd = intval($_GET['wE']);
$monthEnd = intval($_GET['mE']);
$yearEnd = intval($_GET['yE']);

// start hour variables
$startHour = 7;
$endHour = 19;

// start and end of week
$from = strval("{$yearStart}/{$monthStart}/{$weekStart} 00:00:00");
$to = strval("{$yearEnd}/{$monthEnd}/{$weekEnd} 23:00:00");

// get working_slots
$sql = "SELECT time FROM working_slots WHERE 
time BETWEEN ? AND ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $from, $to);
$stmt->execute();
$results = $stmt->get_result();

// if there are results
if($results->num_rows>0){
    // create xml file
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");

    // create root tag
    $slots = $xml->createElement("slots");
    $xml->appendChild($slots);
    
    // for each of the working_slots
    while($row=mysqli_fetch_array($results)){
        // add time to slots 
        $time=$xml->createElement("time", $row['time']);
        $slots->appendChild($time);
    }

    // return xml file
    echo $xml->saveXML();
    $xml->save("report.xml");

} else { 
    // no working slots return false 
    echo "False";
}

?>