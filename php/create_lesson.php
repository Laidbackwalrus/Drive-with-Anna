<?php
// global file
require "config.php";

// get attached data
$studentID = intval($_GET['s']);
$length = intval($_GET['l']);
$dateChosen = intval($_GET['dC']) - 3600;
$price = intval($_GET['p']);

// convert date into correct format
$dateChosen = Date("Y-m-d H:i:s", $dateChosen);

// create new lesson 
$sql = "INSERT INTO lessons (studentID, length, startTime, price)
VALUES (?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iisi", $studentID, $length, $dateChosen, $price);
$stmt->execute();
$results = $stmt->get_result();

// once done return done
echo "done"
?>