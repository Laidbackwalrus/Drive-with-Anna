// function called when the user clicks the signup button
function signupButton(){
    console.log("sign up process started")

    // get user inputs
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    // get elements to display errors in
    let firstNameError = document.getElementById("firstNameError")
    let lastNameError = document.getElementById("lastNameError")
    let emailError = document.getElementById("emailError")
    let passwordError = document.getElementById("passwordError")

    // errors need to be reset incase this is the second time the user is clicking submit
    firstNameError.innerHTML = ""
    lastNameError.innerHTML = ""
    emailError.innerHTML = ""
    passwordError.innerHTML = ""

    // validation check
    let passedChecks = true;

    // first name checks
    if (firstName == ""){ // blank check
        passedChecks = false;
        firstNameError.innerHTML = "Field must not be empty";
    } else if (firstName.length > 35){ // boundary data check
        firstNameError.innerHTML = "Name too long";
        passedChecks = false;
    } else if (/^[A-Za-z]+$/.test(firstName) == false){ // erroneous data check
        passedChecks = false;
        firstNameError.innerHTML = "Names must only container letters";
    }
    
    // last name checks
    if (lastName == ""){ // blank check
        passedChecks = false;
        lastNameError.innerHTML = "Field must not be empty";
    } else if (lastName.length > 35){ // boundary data check
        lastNameError.innerHTML = "Name too long";
        passedChecks = false;
    } else if (/^[A-Za-z]+$/.test(lastName) == false){ // erroneous data check
        passedChecks = false;
        lastNameError.innerHTML = "Names must only container letters";
    }
    
    // email checks
    if (email == ""){ // blank check
        passedChecks = false;
        emailError.innerHTML = "Field must not be empty";
    } else if (email.length > 255){ // boundary data check
        emailError.innerHTML = "Email too long";
        passedChecks = false;
    } else if (emailRejex.test(email) == false) { // erroneous data check
        passedChecks = false;
        emailError.innerHTML = "Please enter a valid email";
    }
    
    // password checks
    if (password == ""){ // blank check 
        passedChecks = false;
        passwordError.innerHTML = "Field must not be empty";
    } else if (password.length > 50){ // boundary data check
        passwordError.innerHTML = "Password too long";
        passedChecks = false;
    } else if (/^[\x00-\x7F]*$/.test(password) == false){ // erroneous data check
        passwordError.innerHTML = "Password must only use ascii characters";
        passedChecks = false;
    }

    // check if all checks were passed
    if (passedChecks == true){
        url = "../../php/signup.php?f=" + firstName + "&l=" + lastName + "&e=" + email + "&p=" + password;
        loadDoc(url, replyHandler);
    }
}

// funtion to deal with reply from signup.php
function replyHandler(reply){
    // if unique email check failed
    if (reply.responseText == "False"){
        emailError.innerHTML = "This email has already been take, please enter a different one";
    } else { // otherwise account successfully created
        // if book lesson version send to pay page
        if (/book-lesson/.test(window.location.href)){
            window.location.href = "http://localhost/pages/book-lesson/pay.html";
        } else{ // otherwise send to homepage
            window.location.href = "http://localhost/index.html";
        }
    }
}

const emailRejex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;