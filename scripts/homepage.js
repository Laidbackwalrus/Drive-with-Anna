function studentReviewsButton(){
    window.location.href = "http://localhost/pages/choose-hours.html";
}


// slideshow
// https://www.w3schools.com/howto/howto_js_slideshow.asp
let slideIndex = 0;
showSlides(); 

function showSlides() {
    // get slides
    let slides = document.getElementsByClassName("slideshowImages");
    // for every slide make them invisible
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }

    // increase global coutner
    slideIndex++;
    // if last image loop back to first image
    if (slideIndex > slides.length) {
        slideIndex = 1
    }

    // make slide with index equal to slide counter visible
    slides[slideIndex-1].style.display = "block";

    // wait then call the funciton agian
    setTimeout(showSlides, 5000); // milliseconds delay
}