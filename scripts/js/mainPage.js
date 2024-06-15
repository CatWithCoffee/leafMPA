function carousel(){
    currentSlide = 0
    carouselItems = document.querySelectorAll('.carouselItem')

    setInterval(() => {
        currentSlide++
        if (currentSlide >= carouselItems.length){
            currentSlide = 0
        }
        else if (currentSlide < 1){
            currentSlide = carouselItems.length-1
        }
        document.querySelector('.carouselInner').style.transform = `translateX(-${currentSlide * 100 / 3}%)`
    }, 3000)
}
carousel()

async function getCityCards() {
    const cityCardTemplate = document.getElementById('cityCardTemplate')
    const cityCards = document.getElementById('cityCards')

    const response = await fetch('../scripts/php/tours/getCities.php',{
        method: 'POST',
        body: JSON.stringify({'cards': 1}),
    })
    const data = await response.json()
    const cities = data.message

    cities.forEach(city => {
        const cityCard = cityCardTemplate.content.cloneNode(true)
        cityCard.querySelector('.cityCardLabel').textContent = city.name
        cityCard.querySelector('.cityCardDescription').textContent = city.description
        cityCard.querySelector('.cityCardImg').src = city.image
        cityCards.appendChild(cityCard)
    })
}
getCityCards()