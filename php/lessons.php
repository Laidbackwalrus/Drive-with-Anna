<?php
// connect to database and run global functions
require "config.php";

// get attached data
$weekStart = intval($_GET['wS']);
$monthStart = intval($_GET['mS']);
$yearStart = intval($_GET['yS']);
$weekEnd = intval($_GET['wE']);
$monthEnd = intval($_GET['mE']);
$yearEnd = intval($_GET['yE']);
$mode = intval($_GET['m']);

// find start and finish of week for sql query
$from = strval("{$yearStart}/{$monthStart}/{$weekStart} 00:00:00");
$to = strval("{$yearEnd}/{$monthEnd}/{$weekEnd} 23:00:00");


if ($mode == 0) { // admin schedule 
    // query database for lessons and students details where the studentId matches between the start and finish for the week 
    $sql = "SELECT l.length, l.startTime, s.studentID, s.firstName, s.lastName, s.email 
    FROM lessons AS l 
    INNER JOIN students AS s ON l.studentID = s.studentID
    WHERE l.startTime BETWEEN ? AND ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $from, $to);
    $stmt->execute();
    $results = $stmt->get_result();

    // if there are more than one result
    if($results->num_rows>0){
        // create xml file to store lessons 
        header("Content-Type: application/xml");
        $xml = new DOMDocument("1.0");
        $lessons=$xml->createElement("lessons");
        $xml->appendChild($lessons);

        // for each of the results insert data into xml file
        while($row=mysqli_fetch_array($results)){
            $lesson=$xml->createElement("lesson");
            $lessons->appendChild($lesson);
        
            $length=$xml->createElement("length", $row['length']);
            $lesson->appendChild($length);
        
            $startTime=$xml->createElement("startTime", $row['startTime']);
            $lesson->appendChild($startTime);
            
            $studentID=$xml->createElement("studentID", $row['studentID']);
            $lesson->appendChild($studentID);

            $firstName=$xml->createElement("firstName", $row['firstName']);
            $lesson->appendChild($firstName);
            
            $lastName=$xml->createElement("lastName", $row['lastName']);
            $lesson->appendChild($lastName);
            
            $email=$xml->createElement("email", $row['email']);
            $lesson->appendChild($email);
        };
    
        // return xml file
        echo $xml->saveXML();
        $xml->save("report.xml");

    } else {
        // if there were no result return false string
        echo "False";
    }
    
} else {// choose date
    // get start times and lenghts of lessons 
    $sql = "SELECT length, startTime FROM lessons
    WHERE startTime BETWEEN ? AND ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $from, $to);
    $stmt->execute();
    $results = $stmt->get_result();

    // if there are results
    if($results->num_rows>0){
        // create xml file
        header("Content-Type: application/xml");
        $xml = new DOMDocument("1.0");
        // create lessons root tag
        $lessons=$xml->createElement("lessons");
        $xml->appendChild($lessons);
        // insert data into root tag 
        while($row=mysqli_fetch_array($results)){
            $lesson=$xml->createElement("lesson");
            $lessons->appendChild($lesson);
        
            $length=$xml->createElement("length", $row['length']);
            $lesson->appendChild($length);
        
            $startTime=$xml->createElement("startTime", $row['startTime']);
            $lesson->appendChild($startTime);
        };
    
        // return xml file
        echo $xml->saveXML();
        $xml->save("report.xml");

    } else {
        // if there are no results return false
        echo "False";
    }
}
?>