currentSlide = 0
carouselItems = document.querySelectorAll('.carouselItem')
function goToSlide(index){
    if (index >= carouselItems.length){
        currentSlide = 0
    }
    else if (currentSlide < 1){
        currentSlide = carouselItems.length-1
    }
    document.querySelector('.carouselInner').style.transform = `translateX(-${currentSlide * 100 / 3}%)`
}
function goToNextSlide(){
    currentSlide++
    goToSlide(currentSlide)
}

function goToPrevSlide(){
    goToSlide(currentSlide - 1)
}

setInterval(goToNextSlide, 3000)