<?php
$server_name = "localhost";
$username = "main_connect";
$password = "";
$database_name = "main_business";

$conn = new mysqli($server_name, $username, $password, $database_name);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// protects against sql injection
function test_input($data) {
  $data = trim($data); // remove whitespaces
  $data = stripslashes($data); // remove slashes
  $data = htmlspecialchars($data); // remove invaild characters
  return $data; // return stripped data
}

// creates and returns a new sessionID
function newSessionID() {
  $length = 32; 
  $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  $charactersLength = strlen($characters); 
  $sessionID = "";
  // for the defined length add a random character from character set to the sessionID
  for ($i = 0; $i < $length; $i++) {
    $sessionID .= $characters[rand(0, $charactersLength - 1)];
  }
  return $sessionID; // returns the sessionId after it has been complete
}
?>