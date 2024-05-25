    // paypal.Buttons({
    //     // Order is created on the server and the order id is returned
    //     createOrder() {
    //       return fetch("/my-server/create-paypal-order", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         // use the "body" param to optionally pass additional order information
    //         // like product skus and quantities
    //         body: JSON.stringify({
    //           cart: [
    //             {
    //               sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
    //               quantity: "YOUR_PRODUCT_QUANTITY",
    //             },
    //           ],
    //         }),
    //       })
    //       .then((response) => response.json())
    //       .then((order) => order.id);
    //     },
    //     // Finalize the transaction on the server after payer approval
    //     onApprove(data) {
    //       return fetch("/my-server/capture-paypal-order", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           orderID: data.orderID
    //         })
    //       })
    //       .then((response) => response.json())
    //       .then((orderData) => {
    //         // Successful capture! For dev/demo purposes:
    //         console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
    //         const transaction = orderData.purchase_units[0].payments.captures[0];
    //         alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
    //         // When ready to go live, remove the alert and show a success message within this page. For example:
    //         // const element = document.getElementById('paypal-button-container');
    //         // element.innerHTML = '<h3>Thank you for your payment!</h3>';
    //         // Or go to another URL:  window.location.href = 'thank_you.html';
    //       });
    //     }
    //   }).render('#paypal-button-container');


// hourly rate of lessons
const price = 30

// get chosen hours
let chosenHours = sessionStorage.getItem("hours")
let cost = price * chosenHours // calculate cost of lesson

// create display string for amount of hours chosen
if(chosenHours == 1){
    lengthStr = chosenHours + " hour"
} else {
    lengthStr = chosenHours + " hours"
}

// get date
let dateChosen = new Date(sessionStorage.getItem("dateChosen"))
let dateStr = dateChosen.toLocaleString() // convert date into string format

// display lesson details
document.getElementById("length").innerHTML = lengthStr
document.getElementById("date").innerHTML = dateStr
document.getElementById("price").innerHTML = "&pound" + price // £ gives Â£


// temporary payment button
function tempPay(){
    let url = "/php/create_lesson.php?s=" + studentID + "&l=" + chosenHours + "&dC=" + Math.floor(dateChosen.getTime()/1000) + "&p=" + price
    loadDoc(url, createLesson)
}

function createLesson(reply){
    // once lesson was create go to homepage
    if (reply.responseText == "done"){
        window.location.href = "http://localhost/index.html"
    }
}