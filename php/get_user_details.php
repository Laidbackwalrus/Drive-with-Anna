<?php
// check if user is signed in
if (isset($_COOKIE["sessionID"])){
    require_once "config.php";
    
    // define variables
    $studentID = $firstName = $lastName = $email = $admin = "";

    // check if php session not been started
    if (session_status() === PHP_SESSION_NONE){ // if it hasnt
        // start the php sessopm
        session_start();
        
        // query database for students details
        $sql = "SELECT studentID, firstName, lastName, email, sessionExpiry, admin 
        FROM students WHERE sessionID = ?";
        $sessionID = $_COOKIE["sessionID"];
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $sessionID);
        $stmt->execute();
        $results = $stmt->get_result();
        
        // for each row in the response
        while($row = mysqli_fetch_array($results)){
            // get student details from response
            $studentID = $row["studentID"];
            $firstName = $row["firstName"];
            $lastName = $row["lastName"];
            $email = $row["email"];
            $admin = $row["admin"];

            // add student details to php session
            $_SESSION["studentID"] = $studentID;
            $_SESSION["firstName"] = $firstName;
            $_SESSION["lastName"] = $lastName;
            $_SESSION["email"] = $email;
            $_SESSION["admin"] = $admin;
            
        }
        
    } else { // if php session has been started
        // get student details from php session
        $studentID = $_SESSION["studentID"];
        $firstName = $_SESSION["firstName"];
        $lastName = $_SESSION["lastName"];
        $email = $_SESSION["email"];
        $admin = $_SESSION["admin"];
    }
    
    // create xml file
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");
    
    // create user root tag
    $user = $xml->createElement("user");
    $xml->appendChild(($user));
    
    // add student details to user 
    $studentID=$xml->createElement("studentID", $studentID);
    $user->appendChild($studentID);
    $firstName=$xml->createElement("firstName", $firstName);
    $user->appendChild($firstName);
    $lastName=$xml->createElement("lastName", $lastName);
    $user->appendChild($lastName);
    $email=$xml->createElement("email", $email);
    $user->appendChild($email);
    $admin=$xml->createElement("admin", $admin);
    $user->appendChild($admin);

    // return xml file
    echo $xml->saveXML();
} else { // if user is not signed in
    // if php session is active end it because this shouldnt be happening
    if (session_status() === PHP_SESSION_ACTIVE){
        session_destroy();
    }
    // return false reply
    echo "False";
}
?>