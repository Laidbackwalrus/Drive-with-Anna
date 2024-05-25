var selectMode = false;
var students = []
let countClient = 0
var countServer = 0

var mouseDown = 0;
document.body.onmousedown = function() { 
    ++mouseDown;
}
document.body.onmouseup = function() {
    --mouseDown;
}

// check if there is enough available slots in a row for a lesson
function checkAvailable(hour, day, min){
    // loop for the amount of slot lesson there are
    for(let i=0; i < chosenHours * 4; i++){
        if (cellStatus[hour*4 + min + i][day] != "available"){
            return false // if any of the check slots are not available 
        }
    }
    return true // if all the slots are avaliable
}

// allows lesson date to be picked
function cellClick(hour, day, min){
    // check if vaild spot for lesson
    if (checkAvailable(hour, day, min)){    
        // constuct date
        let dateCopy = weekStart
        dateCopy.setHours(0,0,0,0)         
        dateCopy.setDate(dateCopy.getDate() + day) // date needs -1
        dateCopy.setMinutes((min) * 15 + (hour + startHour) * 60)

        // store date chosen
        sessionStorage.setItem("dateChosen", dateCopy)
        
        // detect if user is signed in
        if (getCookie("sessionID") != false){
            window.location.href = "http://localhost/pages/book-lesson/pay.html";
        } else {
            // go to next step
            window.location.href = "http://localhost/pages/book-lesson/signin.html";
        }
        
    }
}

// when user hovers over a available slot for there lesson the place where their lesson will go will be highlighted
function cellHover(hour, day, min){
    // check if vaild spot for lesson
    if (checkAvailable(hour, day, min)){
        // for each of the lesson slots in the chosen amount of time
        for (let i = 0; i < chosenHours * 4; i++){
            // find and change cell to highlight
            let tempCal = min + i
            let minCal = tempCal % 4
            let hourCal = hour + Math.floor(tempCal/4)

            let cellToChange = table.rows[hourCal + 1].cells[day + 1].getElementsByTagName("div")[minCal]
            cellToChange.style.backgroundColor = "lime";
        }
    }   
}

// removes highlighted lesson spot when user moves their mouse
function cellNoHover(hour, day, min){
    // check if vaild spot for lesson
    if (checkAvailable(hour, day, min)){
        // for each of the lesson slots in the chosen amount of time
        for (let i = 0; i < chosenHours * 4; i++){
            // find and change cell to unhighlight
            let tempCal = (min + i)
            let minCal = tempCal % 4
            let hourCal = hour + 1 + Math.floor(tempCal/4) 

            let cellToChange = table.rows[hourCal].cells[day + 1].getElementsByTagName("div")[minCal]
            cellToChange.style.backgroundColor = "green";
        }
    }
}

function lessonsChoose(reply){
    if(reply.responseText != "False"){
        // define response variables
        var xmlDoc = reply.responseXML;
        let lesson = xmlDoc.getElementsByTagName("lesson")

        // for each lesons loop
        for (let i = 0; i < lesson.length; i++) {
            // get lesson details
            let lessonLength = lesson[i].getElementsByTagName("length")[0].childNodes[0].nodeValue * 4;
            let startTime = lesson[i].getElementsByTagName("startTime")[0].childNodes[0].nodeValue

            // find day hour and minute of starttime
            workHoursDate = new Date(startTime);
            let day = workHoursDate.getDay();
            let hour = workHoursDate.getHours() - startHour;
            let min = workHoursDate.getMinutes() / 15;

            // adjust day
            if (day != 0){
                day = day - 1
            } else {
                day = 6
            }

            // for the lesson lenght make appropriate changes
            for (let j = 0; j < lessonLength + 1; j++){ // plus one for 15 minute gap
                let tempCal = (min + j);
                let minCal = tempCal % 4;
                let hourCal = hour + Math.floor(tempCal/4);

                let cellToChange = table.rows[hourCal+1].cells[day+1].getElementsByTagName("div")[minCal];
                cellToChange.style.backgroundColor = "#de0b0b"; 
                            
                cellStatus[(hour) * 4 + min + j][day] = "booked";
            }    
        }
    }

    let dateCheck = new Date()
    // if the start of the week is less than the current day
    if (weekStart <= dateCheck){
        // find amount of days to replace
        daysToReplace = dateCheck.getDay()
        if (daysToReplace == 0){
            daysToReplace = 7
        } 

        // for each day
        for (let i = 0; i < daysToReplace; i++) {
            // for every row
            for (let j = 0; j < (endHour - startHour) * 4; j++){
                // make changes to cells
                let minCal = j % 4;
                let hourCal = Math.floor(j/4);

                let cellToChange = table.rows[hourCal+1].cells[i+1].getElementsByTagName("div")[minCal];
                cellToChange.style.backgroundColor = "#de0b0b";
                cellStatus[j][i] = "booked"; // not booked but will remove ablity to click
            }

        }
    }
}


let chosenHours = sessionStorage.getItem("hours")

var date = new Date();
loadPage(date)
