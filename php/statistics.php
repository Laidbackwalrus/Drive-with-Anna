<?php
$yearsDisplaying = 11;

require_once "config.php";

$mode = strval($_GET["m"]);
$year = intval($_GET["y"]);

if ($mode == "0"){ // weeks and months
    // find start and end of year 
    $yearStart = strval("{$year}:01:01");
    $yearEnd = strval("{$year}:12:31");
    
    // query database between start and end of year
    $sql = "SELECT price, startTime FROM lessons 
    WHERE startTime BETWEEN ? AND ?
    ORDER BY startTime;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $yearStart, $yearEnd);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (mysqli_num_rows($result) == 0) { 
        echo "False"; // if no resutls return false
    } else {
        // create xml file to store data
        header("Content-Type: application/xml");
        $xml = new DOMDocument("1.0");
        $xml->formatOutput=true;
    
        // create root tag "lessons"
        $lessons = $xml->createElement("lessons");
        $xml->appendChild($lessons);

        // for each row in the result add data to xml file
        while($row = mysqli_fetch_array($result)){
            $price = $xml->createElement("price", $row['price']);
            $lessons->appendChild($price);
            
            $startTime = $xml->createElement("startTime", $row['startTime']);
            $lessons->appendChild($startTime);
        }  
        // return xml file to browser
        echo $xml->saveXML();
    }

} else { // years 
    // create xml file and root node "years"
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");
    $xml->formatOutput=true;
    $years = $xml->createElement("years");
    $xml->appendChild($years);

    // calcaulte starting year
    $year = $year - floor($yearsDisplaying/2);

    // for each year going to be displayed
    for ($i=0; $i < $yearsDisplaying; $i++){ 
        // find start and end of year
        $yearTotal = 0; 
        $yearStart = strval("{$year}:01:01");
        $yearEnd = strval("{$year}:12:31");
        $year = $year + 1;

        // query database for the price of every lesson within year
        $sql = "SELECT price FROM lessons 
        WHERE startTime BETWEEN ? AND ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $yearStart, $yearEnd);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if (mysqli_num_rows($result) == 0) { // if no rows 
            // year total set to 0 and added to xml file
            $yearTotal = $xml->createElement("yearTotal", 0);
            $years->appendChild($yearTotal);
        } else { // if there are rows
            // for every row
            while($row = mysqli_fetch_array($result)){
                // add price from row to year total
                $yearTotal = $yearTotal + $row['price'];
            }  
            // add year total to xml file
            $yearTotal = $xml->createElement("yearTotal", $yearTotal);
            $years->appendChild($yearTotal);
        }
    }
    // xml file returned to browser
    echo $xml->saveXML();
}
?>