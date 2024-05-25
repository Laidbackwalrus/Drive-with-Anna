<?php
require_once "config.php";

$sessionID = test_input(strval($_GET["ID"]));

$date = Date("Y-m-d h:i:s");

$sql = "SELECT l.startTime FROM lessons AS l 
INNER JOIN students AS s ON l.studentID = s.studentID
WHERE l.startTime >  ? AND s.sessionID = ?;";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $date, $sessionID);
$stmt->execute();
$result = $stmt->get_result();

if (mysqli_num_rows($result) == 0) { 
    echo "False";
} else {
    // while($row = mysqli_fetch_array($result)){
    //     echo $row ["startTime"];
    // }
}
?>