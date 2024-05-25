const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const startHour = 7;
const endHour = 18;
var cellStatus = []
const cellHeight = 100/(endHour - startHour + 1)
let URLdata = ""
let weekStart = ""

function loadPage(date){
    console.log(date)
    // delele table 
    var elementsToDelete = document.getElementsByClassName("deleteClass");
    while(elementsToDelete[0]) {
        elementsToDelete[0].parentNode.removeChild(elementsToDelete[0]);
    }
    
    // create rest of table
    var table = document.getElementById("table"); 
    // loop for all the hours between end and start hour variables
    for (let i = 0; i < endHour - startHour; i++){
        // create new row
        let newRow = document.createElement("tr");
        newRow.className = "deleteClass";
        
        //create time cell
        let timeCell = document.createElement("th");
        timeCell.style.height = cellHeight + "%"
        timeCalc = i + startHour;
        var startTime = timeCalc;
        var endTime = startTime + 1;
        startTime = startTime.toString()+":00";
        endTime = endTime.toString()+":00";
        timeCell.innerHTML = startTime + " - " + endTime;
        newRow.appendChild(timeCell) // add timecell to row
        
        // create other empty cells
        for(let j = 0; j < 7; j++){
            newCell = document.createElement("td");
            newCell.style.height = cellHeight + "%"
            
            // creates 4 quarters for each hour 
            for(let k = 0; k < 4; k++){
                newQuarter = document.createElement("div");
                newQuarter.id = k
                newQuarter.onmouseover = function (){
                    cellHover(i, j, k);
                }
                newQuarter.onmousedown = function(){ // changed from onclick because of first cell not appearing
                    cellClick(i, j, k)
                }
                newQuarter.onmouseleave = function(){
                    cellNoHover(i, j, k)
                }
                newCell.appendChild(newQuarter); // adds quarter to cell
            }
            newRow.appendChild(newCell); // add cell to row
        }
        table.appendChild(newRow); // add row to table
    }
    
    // day adjustments
    var day = date.getDay();
    if (day != 0){
        day = day - 1
    } else {
        day = 6
    }
        
    // get day month and year for the start and end of the week
    weekStart = new Date(date.getTime())
    weekStart.setDate(weekStart.getDate() - day) 
    let weekEnd = new Date(weekStart.getTime())
    weekEnd.setDate(weekEnd.getDate() + 6) 
    let weekStartDay = weekStart.getDate()
    let weekStartMonth = months[weekStart.getMonth()];
    let weekStartYear = weekStart.getYear() + 1900;
    let weekEndDay = weekEnd.getDate()
    let weekEndMonth = months[weekEnd.getMonth()];
    let weekEndYear = weekEnd.getYear() + 1900;
    
    
    // update header on page
    const dateHeader = document.getElementById("date");
    dateStr = weekStartDay + " " + weekStartMonth + " " + weekStartYear + " - " + weekEndDay + " " + weekEndMonth + " " + weekEndYear;
    dateHeader.innerHTML = dateStr


    // create matrix to store cell status
    cellStatus = []
    for (let i = 0; i < (endHour - startHour + 1) * 4; i++) { // plus one to make bottom row not error
        let row = [];
        for (let j = 0; j < 7; j++) {
            let hour = null;
            row.push(hour)
        }
        cellStatus.push(row)
    }
    
    // php connection
    URLdata = "wS=" + weekStartDay + "&mS=" + (weekStart.getMonth() + 1) + "&yS=" + weekStartYear + "&wE=" + weekEndDay + "&mE=" + (weekEnd.getMonth() + 1) + "&yE=" + weekEndYear;
    loadDoc("/php/working_slots.php?" + URLdata, working_slots);
}

// loads working slots
function working_slots(reply){
    // if there was working slots returned
    if(reply.responseText != "False"){
        // defines returned data into eaiser to access variables
        var xmlDoc = reply.responseXML;
        let slots = xmlDoc.getElementsByTagName("time")       

        // loop for ever working slot returned
        for (let i = 0; i < slots.length; i++) {
            // gets day hour and minute of slot start time
            let workHoursDate = new Date(slots[i].textContent);
            let day = workHoursDate.getDay();
            let hour = workHoursDate.getHours() - startHour; // 
            let min = workHoursDate.getMinutes() / 15;
            
            // day adjustment
            if (day != 0){
                day = day - 1
            } else {
                day = 6
            }

            // makes changes to cells 
            let cellToChange = table.rows[hour + 1].cells[day + 1].getElementsByTagName("div")[min]
            cellToChange.style.backgroundColor = "green";

            cellStatus[(hour) * 4 + min][day] = "available"
        }
    }

    // checks what page is loaded to run the correct lesson module
    if (/schedule/.test(window.location.href)){
        // admin schedule, m=0
        loadDoc("/php/lessons.php?" + URLdata + "&m=0", lessonsSchedule)
    } else {
        // choose date, m=1 
        loadDoc("/php/lessons.php?" + URLdata + "&m=1", lessonsChoose)
    }
}



function nextWeekButton() {
    // load next week
    date.setDate(date.getDate() + 7);
    loadPage(date)
}


function previousWeekButton() {
    // if (true){
    if (/schedule/.test(window.location.href)){
        // load last week
        date.setDate(date.getDate() - 7);
        loadPage(date)
    } else{
        // if this is book lesson version need to check user isnt going to pervious week
        // defines dates to compare
        let currentDate = new Date();
        let tempDate = new Date(date.getTime());

        // get rid of delay that would fail equals condition 
        currentDate.setHours(0,0,0,0)
        tempDate.setHours(0,0,0,0)

        // checks if the date trying to be displayed would be greater than or equal to the current date 
        if (currentDate.getTime() < tempDate.getTime()){ 
            // load last week
            date.setDate(date.getDate() - 7);
            loadPage(date)
        }
    }
}

function cellHover(i,j,k){

}
function cellNoHover(i,j,k){

}
function cellClick(i,j,k){

}