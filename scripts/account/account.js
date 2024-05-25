// sign out button
document.getElementById("signout_button").onclick = function(){
    // sets expiry date of cookie for previous date so that it deletes
    document.cookie = "sessionID" + "=" +
    (("/") ? ";path="+"/":"")+
    (("localhost")?";domain="+"localhost":"") +
    ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // sends user to homepage
    window.location.href = "/index.html"
}

function loadAccount(reply) {
    // adds details to input boxes
    // value used instead because boxes are <input> tags
    document.getElementById("firstName").value = firstName
    document.getElementById("lastName").value = lastName
    document.getElementById("email").value = email
    
    // if there is lesson in future
    if (reply.responseText != "False"){
        // get lesson detail from response
        xmlDoc = reply.responseXML;
        let startTime = xmlDoc.getElementsByTagName("startTime")[0].innerHTML
        let length = xmlDoc.getElementsByTagName("length")[0].innerHTML

        // switch visible div
        document.getElementById("lessonFalse").style.display = "none"
        document.getElementById("lessonTrue").style.display = "block"

        // display lesson details
        document.getElementById("length").innerHTML += length + " hours"
        document.getElementById("date").innerHTML += startTime
    }
}

function delay(){
    // console.log(firstName, lastName, email)
    let url2 = "/php/get_lesson.php?ID=" + studentID
    loadDoc(url2, loadAccount)
}


window.setTimeout(delay, 100)


