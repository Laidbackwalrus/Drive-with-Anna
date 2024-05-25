function hoursButton(chosenHours){
  sessionStorage.setItem("hours", chosenHours)
  window.location.href = "http://localhost/pages/book-lesson/choose-date.html";
}

