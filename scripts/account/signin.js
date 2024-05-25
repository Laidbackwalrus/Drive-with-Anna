function signinButton(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // sends inputs to server
    let url = "/php/signin.php?e=" + email + "&p=" + password;
    loadDoc(url, replyHandler)
}

function replyHandler(reply){
    reply = reply.responseText
    if (reply == "False"){
        // displays error
        document.getElementById("error").style.display = "block";
    } else {
        // check if book-lesson is in the url
        if (/book-lesson/.test(window.location.href)){
            window.location.href = "http://localhost/pages/book-lesson/pay.html";
        } else{
            window.location.href = "http://localhost/index.html";
        }
    }
}

