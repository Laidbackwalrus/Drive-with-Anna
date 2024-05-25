url = "/php/student_reviews.php";
loadDoc(url, afunciton);

function afunciton(reply){
    if (reply.responseText != "reply"){
        var xmlDoc = reply.responseXML;
        var root = xmlDoc.getElementsByTagName("reviews");
    
        for (let i = 0; i <= root.length; i++) {
            let review = document.createElement("div");
            let nameContainer = document.createElement("")

            let firstName = root[0].getElementsByTagName("firstName")[i].childNodes[0].nodeValue;
            let rating = root[0].getElementsByTagName("rating")[i].childNodes[0].nodeValue;
            let reviewDate = root[0].getElementsByTagName("reviewDate")[i].childNodes[0].nodeValue;
            let reviewDis = root[0].getElementsByTagName("reviewDis")[i].childNodes[0].nodeValue;
    
            cellToChange = table.rows[serverHour].cells[serverDay]
            cellToChange.style.backgroundColor = "green";
        }

    } else {
        console.log("no reviews")
    }
}
