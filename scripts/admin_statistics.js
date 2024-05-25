let barGraph = new Chart("barGraph",{
    type: "bar", // set graph type to bar chart
    data: {
        // adding default data to fix bar not appearing
        label: ["yes"],
        datasets: [{
            data: [300],
            backgroundColor: "#003f5c" // setting default colour of bars
        }]
    },
    options: {
        maintainAspectRatio: false, // allows graph to be changed to fit on page
        legend: {
            display: false // removes labels used for multiple datasets
        },
    },
});

// https://www.chartjs.org/docs/latest/developers/updates.html
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// https://www.chartjs.org/docs/latest/developers/updates.html
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

// runs the remove data function a certain amount of times depending on what the last clicked button was
function resetChart(){
    if (lastClicked == "year"){
        for(let i = 0; i < yearsDisplaying; i++){
            removeData(barGraph)
        }
    } else if (lastClicked == "month"){
        for(let i = 0; i < 12; i++){
            removeData(barGraph)
        }
    } else {
        for(let i = 0; i < 52; i++){
            removeData(barGraph)
        }
    }
}

// load different types of time graph
function chooseTime(type){
    resetChart()
    document.getElementById("date").innerHTML = year // change date
    lastClicked = type 

    if (type == "week"){
        let url = "/php/statistics.php?m=0&y=" + year
        loadDoc(url, weekGraph)
    } else if (type == "month"){
        let url = "/php/statistics.php?m=0&y=" + year
        loadDoc(url, monthGraph)
    } else {
        let url = "/php/statistics.php?m=1&y=" + year
        loadDoc(url, yearGraph)
    }
}


function monthGraph(reply){  
    // if there is data
    if (reply.responseText != "False"){
        // create date for first of the year
        let dateCopy = date
        dateCopy.setFullYear(year, 1, 1) // first of feb
        dateCopy.setHours(0,0,0)
        // console.log(dateCopy)
        
        // variables to store data easier
        let xmlDoc = reply.responseXML
        let prices = xmlDoc.getElementsByTagName("price")
        let startTimes = xmlDoc.getElementsByTagName("startTime")
        
        // creating list to store totals for each month
        let months = []
        for(let i = 0; i < 12; i++){
            let month = 0
            months.push(month)
        }
        
        // adding data to their correct spots in the arrays 
        let monthCounter = 0
        for(let i = 0; i < prices.length; i++){
            let tempDate = new Date(startTimes[i].innerHTML)
            
            // check if data fits into month
            // if it doesnt move to next month repeating untill condition met
            while (tempDate >= dateCopy){
                monthCounter = monthCounter + 1
                dateCopy.setFullYear(year, monthCounter + 1, 1)
                // console.log(dateCopy)
            }
            
            // add price to correct month's total
            months[monthCounter] = months[monthCounter] + parseInt(prices[i].innerHTML)
        }
        
        // add data to graph
        for(let i = 0; i < 12; i++){
            addData(barGraph, monthLables[i], months[i]) // use months array with index to add correct label
        }
    }
}

function weekGraph(reply){
    // if there is data
    if (reply.responseText != "False"){
        // create date for first of the year
        let dateCopy = date
        dateCopy.setFullYear(year, 0, 1)
        dateCopy.setHours(0,0,0)
        // console.log(dateCopy)
        
        // variables to store data easier
        let xmlDoc = reply.responseXML
        let prices = xmlDoc.getElementsByTagName("price")
        let startTimes = xmlDoc.getElementsByTagName("startTime")
        
        // creating list to store totals for each week
        // creating lables list for each week
        let weeks = []
        let weekLables = []
        for(let i = 0; i < 52; i++){
            let week = 0
            weeks.push(week)
            weekLables.push(i+1)
        }

        // adding data to their correct spots in the total list
        let weekCounter = 0
        for(let i = 0; i < prices.length; i++){
            let tempDate = new Date(startTimes[i].innerHTML)
            
            // check if data fits into end of the week
            // if it doesnt move to next week repeating until condition met
            while (tempDate >= dateCopy){
                weekCounter = weekCounter + 1
                dateCopy.setDate(dateCopy.getDate() + 7)
                // console.log(dateCopy)
            }
            
            // add price to correct week's total
            weeks[weekCounter] = weeks[weekCounter] + parseInt(prices[i].innerHTML)
            
            
            // console.log(prices[i].innerHTML)
            // console.log(startTimes[i].innerHTML)
        }
        // console.log(weeks)
        
        // add data to graph
        for(let i = 0; i < 52; i++){
            addData(barGraph, weekLables[i], weeks[i])
        }
    }
}


function yearGraph(reply){
    // variables to make accesing reply data easier
    let xmlDoc = reply.responseXML;
    let yearTotals = xmlDoc.getElementsByTagName("yearTotal")
    
    // find start year for labels
    let yearCopy = year
    yearCopy = yearCopy - Math.floor(yearsDisplaying / 2)

    // for each year returned add it to the array
    for (let i = 0; i < yearTotals.length; i++) {
        addData(barGraph, yearCopy + i, yearTotals[i].innerHTML)
    }
}


function nextButton(){
    year = year + 1
    removeData(barGraph)
    chooseTime(lastClicked)
}

function previousButton(){
    year = year - 1
    removeData(barGraph)
    chooseTime(lastClicked)
}





const monthLables = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearsDisplaying = 11 // change in statistics.php aswell
var lastClicked = "year"

// var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
// var yValues = [55, 49, 44, 24, 15];
// var barColors = ["red", "green","blue","orange","brown"];





// get year
let date = new Date()
let year = date.getYear();
year = year + 2000 - 100; // year adjustments

removeData(barGraph) // remove default data
chooseTime("year") // load years graph
