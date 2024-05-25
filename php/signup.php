<?php
// runs global php file
require_once "config.php";


// gets and strips user inputs
$firstName = test_input(strval($_GET["f"]));
$lastName = test_input(strval($_GET["l"]));
$email = test_input(strval($_GET["e"]));
$password = test_input(strval($_GET["p"]));


// defines and sends sql request
$sql = "SELECT email FROM students 
WHERE email = ?;"; 
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();



// if there are more than one result
if (mysqli_num_rows($result) != 0) { 
    echo "False";
} else { // create users account
    // creates password hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // creates new session, calculate expiry and set sessionID cookie
    $sessionID = newSessionID();
    $sessionExpiry = strtotime("+1 Months");
    setcookie("sessionID", $sessionID, $sessionExpiry, "/");

    // inserts data into database    
    $sql = "INSERT INTO students (firstName, lastName, email, passwordHash, sessionID, sessionExpiry)
    VALUES (?,?,?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss",$firstName, $lastName, $email, $passwordHash, $sessionID, date("Y-m-d h:i:sa", $sessionExpiry));
    $stmt->execute();
}
?>
