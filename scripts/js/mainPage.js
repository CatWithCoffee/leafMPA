async function carousel(){
    const response = await fetch('../scripts/php/mainPage/getCountries.php')
    const data = await response.json()
    const countries = data.message

    const carouselItemTemplate = document.getElementById('carouselItemTemplate')
    const carouselInner = document.querySelector('.carouselInner')

    countries.forEach(country => {
        const carouselItem = carouselItemTemplate.content.cloneNode(true)
        carouselItem.querySelector('.carouselText').textContent = country.description
        carouselItem.querySelector('.carouselImg').src = country.image
        carouselInner.append(carouselItem)
    })

    let currentSlide = 0
    const carouselItems = document.querySelectorAll('.carouselItem')

    setInterval(() => {
        currentSlide++
        if (currentSlide >= carouselItems.length){
            currentSlide = 0
        }
        else if (currentSlide < 1){
            currentSlide = carouselItems.length-1
        }
        carouselInner.style.transform = `translateX(-${currentSlide * 100 / carouselItems.length}%)`
    }, 3000)
}
carousel()

async function getCityCards() {
    const response = await fetch('../scripts/php/tours/getCities.php',{
        method: 'POST',
        body: JSON.stringify({'cards': 1}),
    })
    const data = await response.json()
    const cities = data.message

    const cityCardTemplate = document.getElementById('cityCardTemplate')
    const cityCards = document.getElementById('cityCards')

    cities.forEach(city => {
        const cityCard = cityCardTemplate.content.cloneNode(true)
        cityCard.querySelector('.cityCardLabel').textContent = city.name
        cityCard.querySelector('.cityCardDescription').textContent = city.description
        cityCard.querySelector('.cityCardImg').src = city.image
        cityCards.appendChild(cityCard)
    })

}
getCityCards()

async function getArticleCards(){
    const response = await fetch('../scripts/php/mainPage/getArticles.php')
    const data = await response.json()
    const articles = data.message
    console.log(articles)

    const articleCardTemplate = document.getElementById('articleCardTemplate')
    const articleCards = document.getElementById('articleCards')

    articles.forEach(article => {
        const articleCard = articleCardTemplate.content.cloneNode(true)
        articleCard.querySelector('.articleCardLabel').textContent = article.title
        articleCard.querySelector('.articleCardDescription').innerHTML = article.description
        articleCard.querySelector('.articleCardImg').src = article.image
        articleCards.appendChild(articleCard)
    })
}
getArticleCards()

async function getAdvantages(){
    const response = await fetch('../scripts/php/mainPage/getAdvantages.php')
    const data = await response.json()
    const advantages = data.message

    const advantageTemplate = document.getElementById('advantageTemplate')
    const advantagesInner = document.getElementById('advantagesInner')

    advantages.forEach(advantage => {
        const advantageItem = advantageTemplate.content.cloneNode(true)
        advantageItem.querySelector('.advantageImg').src = advantage.image
        advantageItem.querySelector('.advantageLabel').textContent = advantage.label
        advantageItem.querySelector('.advantageDescription').textContent = advantage.description
        advantagesInner.appendChild(advantageItem)
    })
}
getAdvantages()