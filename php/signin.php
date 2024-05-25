<?php
// runs global php file
require_once "config.php";

// gets and strips user inputs
$email = test_input(strval($_GET["e"]));
$password = test_input(strval($_GET["p"]));

// defines and sends sql request
$sql = "SELECT * FROM students 
WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// if there are 0 rows of in the result
if (mysqli_num_rows($result) == 0) { 
    echo "False"; // runs if there are no matching emails
} else {
    // define $row as one of the rows in the result and loop through them 
    while($row = mysqli_fetch_array($result)){
        // get password hash and define it as a variable
        $passwordHash = $row["passwordHash"];
        
        // check if password matches
        if(password_verify($password, $passwordHash)){
            $sessionID = $row["sessionID"];
            $sessionExpiry = $row["sessionExpiry"];

            // if session epiry in datebase has passed, create new sessionId and update database
            if ($row["sessionExpiry"] < date("Y-m-d")){
                $sessionID = newSessionID();
                $sessionExpiry = date("Y-m-d", strtotime("+1 Month"));
                
                $sql = "UPDATE students 
                SET sessionID = ?, sessionExpiry = ? WHERE email = ?";
        
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("sss", $sessionID, $sessionExpiry, $email);
                $stmt->execute();
            }
        
            setcookie("sessionID", $sessionID, strtotime($sessionExpiry), "/");

        } else { 
            echo "False"; // runs if password doesnt match
        }
    }
}  
?>