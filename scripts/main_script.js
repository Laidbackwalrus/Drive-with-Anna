var studentID, firstName, lastName, email, admin

// ajax function
function loadDoc(url, cFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

// gets cookies value https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

// for dealing with user details
function userDetails(reply){
    // if the user is signed in
    if (reply.responseText != "False"){
        // get user details
        var xmlDoc = reply.responseXML;
        var user = xmlDoc.getElementsByTagName("user");
        studentID = user[0].getElementsByTagName("studentID")[0].childNodes[0].nodeValue;
        firstName = user[0].getElementsByTagName("firstName")[0].childNodes[0].nodeValue;
        lastName = user[0].getElementsByTagName("lastName")[0].childNodes[0].nodeValue;
        email = user[0].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        admin = user[0].getElementsByTagName("admin")[0].childNodes[0].nodeValue;

        // console.log(studentID, firstName, lastName, email, admin)

        // remove sign in button
        document.getElementById("signin").remove();
        
        // create account button with student name
        node = document.createElement("a");
        node.innerHTML = firstName;
        node.href = "/pages/account-pages/account.html";
        node.classList = "right";

        // check if account page is open to add active class
        var sPath = window.location.pathname;
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        if(sPage == "account.html"){
            node.classList = "active right"
        }

        // add account button to navbar
        document.getElementById("navbar").appendChild(node);
        
        // if user is an admin
        if (admin == 1){
            // create schedule button
            f1 = document.createElement("a");
            f1.innerHTML = "Schedule";
            f1.href = "/pages/schedule-admin.html"

            // create statistics button
            f2 = document.createElement("a");
            f2.innerHTML = "Statistics";
            f2.href = "/pages/statistics-admin.html"
            
            // check if stats or schedule page is open adding active class to highlight as required
            if(sPage == "schedule-admin.html"){
                f1.classList = "active"
            }
            else if(sPage  == "statistics-admin.html"){
                f2.classList = "active"
            }

            // add button to navbar
            let navbar = document.getElementById("navbar")
            navbar.appendChild(f1);
            navbar.appendChild(f2);
        }

        // redirecting user if they attempt to book a lesson when they already have a lesson booked
        // admins will not be redirected
        if (/book-lesson/.test(window.location.href)){
            let cookieCheck = getCookie("sessionID")
            if (cookieCheck != false){
                if (admin != 1){
                    let url = "/php/check_lesson.php?ID=" + cookieCheck
                    loadDoc(url, checkLesson)
                }
            }
        }
        
    }
}

// sends user to redirect page if they have already booked a lesson
function checkLesson(reply){
    if (reply.responseText != "False"){
        window.location.href = "/pages/redirect.html"
    }
}

// send user to choose hour page if they click the book lesson button
function bookLessonButton(){
    window.location.href = "http://localhost/pages/book-lesson/choose-hours.html";
}

// gets the users details
let url = "/php/get_user_details.php";
loadDoc(url, userDetails)  
