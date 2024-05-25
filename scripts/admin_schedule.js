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

function checkCell(hour, day, min){
    let cellToChange = table.rows[hour+1].cells[day+1].getElementsByTagName("div")[min]

    if(cellStatus[(hour) * 4 + min][day] == null){ // nothing to temp asignment
        cellStatus[(hour) * 4 + min][day] = "selected"
        cellToChange.style.backgroundColor = "rgb(0, 255, 0)"
    } else if(cellStatus[(hour) * 4 + min][day] == "selected"){ // selected to nothing again
        cellStatus[(hour) * 4 + min][day] = null
        cellToChange.style.backgroundColor = "white"
    } else if(cellStatus[(hour) * 4 + min][day] == "available"){ // avaliable slot to temp nothing
        cellStatus[(hour) * 4 + min][day] = "unselected"
        cellToChange.style.backgroundColor = "grey"
    } else if(cellStatus[(hour) * 4 + min][day] == "unselected"){ // was changed to nothing from avaliable needs to go back to original
        cellStatus[(hour) * 4 + min][day] = "available"
        cellToChange.style.backgroundColor = "green"
    }
}

function cellClick(hour, day , min){
    if(selectMode == false){
        let cellBeingChecked = cellStatus[(hour) * 4 + min][day]
        // if cell being checked is a number
        if (typeof cellBeingChecked == "number"){
            for(let i = 0; i < students.length; i++){ // search for all items in students array
                if (students[i][0] == cellBeingChecked){
                    // insert data found into student details section
                    document.getElementById("firstNameDetails").innerHTML = students[i][1]
                    document.getElementById("lastNameDetails").innerHTML = students[i][2]
                    document.getElementById("emailDetails").innerHTML = students[i][3]
                    break // stop searching algorithm becuse student was found
                }
            }
        }
    } else {
        checkCell(hour, day, min)        
    }
}

function cellHover(hour, day, min){
    if(selectMode == true){
        if(mouseDown){
            checkCell(hour, day, min)
        }
    }
}

function cellNoHover(){
    
}

function selectButton() {
    if(selectMode == false){
        selectMode = true
        document.getElementById("confirmButton").style.display = "block" // make confirm button appear
        document.getElementById("selectButton").classList.add("selectActive") // highlight select button
        document.getElementById("selectButton").innerHTML = "Cancel"
    } else{
        location.reload() // easier to just reload
    }
}

function confirmButton() {
    // searching each row in the cell status array
    for (let i = 0; i < (endHour - startHour) * 4; i++){
        // searching each column in each row
        for (let j = 0; j < 7; j++){
            // if cell status of cell being checked is selected or unselected 
            if (cellStatus[i][j] == "selected" || cellStatus[i][j] == "unselected"){
                // find timestamp for cell
                let slotTime = new Date(weekStart.getTime()) // same method as in table.js
                slotTime.setHours(0,0,0,0) // reset time
                slotTime.setDate(slotTime.getDate() + j) // set day
                slotTime.setHours(startHour + Math.floor(i/4))
                slotTime.setMinutes((i%4) * 15) // set time
                slotTime = Math.floor(slotTime.getTime()/1000)
                
                if (cellStatus[i][j] == "selected"){ 
                    // add slot, m=0
                    let slotURL = "/php/slot.php?sT=" + slotTime + "&m=0"
                    loadDoc(slotURL, returnFunction)
                } else { 
                    // delete slot, m=1
                    let slotURL = "/php/slot.php?sT=" + slotTime + "&m=1"
                    loadDoc(slotURL, returnFunction)
                }
                // client side request sent
                countClient = countClient + 1
            }
        }
    }
    // checking if serverside process are finished
    checkServerResponse()
}

// function to check if serverside process are finished
function checkServerResponse(){
    if (countClient != countServer){
        window.setTimeout(checkServerResponse, 100)
    } else {
        location.reload()
    }
}

function returnFunction(reply){
    // server side proccess complete
    countServer = countServer + 1
}


function lessonsSchedule(reply){
    if(reply.responseText != "False"){
        var xmlDoc = reply.responseXML;

        // lessons
        let lesson = xmlDoc.getElementsByTagName("lesson")
        for (let i = 0; i < lesson.length; i++) {
            // getting student data
            let lessonLength = lesson[i].getElementsByTagName("length")[0].childNodes[0].nodeValue * 4;
            let startTime = lesson[i].getElementsByTagName("startTime")[0].childNodes[0].nodeValue
            let studentID = lesson[i].getElementsByTagName("studentID")[0].childNodes[0].nodeValue
            let firstName = lesson[i].getElementsByTagName("firstName")[0].childNodes[0].nodeValue
            let lastName = lesson[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue
            let email = lesson[i].getElementsByTagName("email")[0].childNodes[0].nodeValue
            studentID = parseInt(studentID) // xml data is always string

            // putting student data into students array
            let student = []
            student.push(studentID)
            student.push(firstName)
            student.push(lastName)
            student.push(email)
            students.push(student)

            // console.log(lessonLength, startTime, firstName, lastName, email)
            // console.log(students)

            // finding day hour and minute of start time
            workHoursDate = new Date(startTime);
            let day = workHoursDate.getDay();
            let hour = workHoursDate.getHours() - startHour;
            let min = workHoursDate.getMinutes() / 15;

            // adjusting day
            if (day != 0){
                day = day - 1
            } else {
                day = 6
            }

            // inserting lesson into table and matrix
            for (let j = 0; j < lessonLength; j++){
                // overflow calculations
                let tempCal = (min + j);
                let minCal = tempCal % 4;
                let hourCal = hour + Math.floor(tempCal/4);
                // console.log(minCal, hourCal)

                // changing table
                let cellToChange = table.rows[hourCal+1].cells[day+1].getElementsByTagName("div")[minCal];
                cellToChange.style.backgroundColor = "red";
                
                // putting names into first and second slots
                if(j == 0){
                    cellToChange.innerHTML = firstName
                } else if(j == 1){
                    cellToChange.innerHTML = lastName
                }
            
                // changing matrix
                cellStatus[(hour) * 4 + min + j][day] = studentID;
            }    
        }
    }
}

var date = new Date();
loadPage(date)
