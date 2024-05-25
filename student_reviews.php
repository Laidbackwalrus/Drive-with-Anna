<?php
require "config.php";

$sql = "SELECT students.firstName, reviews.rating, reviews.reviewDate, reviews.review, reviews.image
        FROM reviews
        INNER JOIN students ON reviews.studentID = students.studentID";

$results = $conn->query($sql);

if ($results->num_rows > 0){
    header("Content-Type: application/xml");
    $xml = new DOMDocument("1.0");
    $xml->formatOutput=true;

    $reviews = $xml->createElement("reviews");
    $xml->appendChild($reviews);
    while($row = mysqli_fetch_array($results)){
        $review = $xml->createElement("review");
        $reviews->appendChild($review);
            
        $firstName = $xml->createElement("firstName", $row['firstName']);
        $review->appendChild($firstName);
    
        $rating = $xml->createElement("rating", $row['rating']);
        $review->appendChild($rating);
        
        $reviewDate = $xml->createElement("reviewDate", $row['reviewDate']);
        $review->appendChild($reviewDate);

        $reviewDis = $xml->createElement("reviewDis", $row['reviewDis']);
        $review->appendChild($reviewDis);

        // image stuff aswell

        echo $xml->saveXML();
    };
} else {
    echo "False";
}
?>