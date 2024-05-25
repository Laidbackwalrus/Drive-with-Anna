<?php
// run global file
require "config.php";

// get attached data
$studentID = intval($_GET['ID']);
$currentDate = date("Y/m/d");

// get lessons query
$sql = "SELECT length, startTime FROM lessons 
WHERE studentID = ? AND startTime > ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $studentID, $currentDate);
$stmt->execute();
$results = $stmt->get_result();

// if there is a lesson past current date
if($results->num_rows>0){
    // create xml file
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");

    // create root tag
    $lesson = $xml->createElement("lesson");
    $xml->appendChild($lesson);

    // for each row in the response
    while($row=mysqli_fetch_array($results)){// add length and startTime to xml file for row  
        $length=$xml->createElement("length", $row['length']);
        $lesson->appendChild($length);
    
        $startTime=$xml->createElement("startTime", $row['startTime']);
        $lesson->appendChild($startTime);
    };
    
    // return xml file
    echo $xml->saveXML();
    $xml->save("report.xml");
} else {
    // no lesson
    return "False";
}
?>