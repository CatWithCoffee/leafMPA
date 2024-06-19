async function carousel(){ //заполнение и анимация слайдера
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'countries'}),
    })
    const data = await response.json()
    const countries = data.message

    const carouselItemTemplate = document.getElementById('carouselItemTemplate') //шаблон элемента слайдера
    const carouselInner = document.querySelector('.carouselInner') //контейнер слайдера

    countries.forEach(country => { //создание и заполнение элементов слайдера
        const carouselItem = carouselItemTemplate.content.cloneNode(true)
        carouselItem.querySelector('.carouselText').textContent = country.description
        carouselItem.querySelector('.carouselImg').src = country.image
        carouselInner.append(carouselItem)
    })

    let currentSlide = 0
    const carouselItems = document.querySelectorAll('.carouselItem')

    setInterval(() => { //перелистывание элементов
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

async function getCityCards() { //создание карточек с недавно добавленными городами
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'cityCards'}),
    })
    const data = await response.json()
    const cities = data.message

    const cityCardTemplate = document.getElementById('cityCardTemplate') //шаблон карточек
    const cityCards = document.getElementById('cityCards') //контейнер карточек

    cities.forEach(city => { //создание и заполнение карточек
        const cityCard = cityCardTemplate.content.cloneNode(true)
        cityCard.querySelector('.cityCardLabel').textContent = city.name
        cityCard.querySelector('.cityCardDescription').textContent = city.description
        cityCard.querySelector('.cityCardImg').src = city.image
        cityCards.appendChild(cityCard)
    })

}
getCityCards()

async function getArticleCards(){ //создание боковых карточек
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'articleCards'}),
    })
    const data = await response.json()
    const articles = data.message

    const articleCardTemplate = document.getElementById('articleCardTemplate') //шаблон карточек
    const articleCards = document.getElementById('articleCards') //контейнер карточек

    articles.forEach(article => { //создание и заполнение карточек
        const articleCard = articleCardTemplate.content.cloneNode(true)
        articleCard.querySelector('.articleCardLabel').textContent = article.name
        articleCard.querySelector('.articleCardDescription').innerHTML = article.description
        articleCard.querySelector('.articleCardImg').src = article.image
        articleCards.appendChild(articleCard)
    })
}
getArticleCards()

async function getAdvantages(){ //заполнение блока с преимуществами компании
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'advantages'}),
    })
    const data = await response.json()
    const advantages = data.message

    const advantageTemplate = document.getElementById('advantageTemplate') //шаблон элемента
    const advantagesInner = document.getElementById('advantagesInner') //контейнер для элементов

    advantages.forEach(advantage => { //создание и заполнение
        const advantageItem = advantageTemplate.content.cloneNode(true)
        advantageItem.querySelector('.advantageImg').src = advantage.image
        advantageItem.querySelector('.advantageLabel').textContent = advantage.name
        advantageItem.querySelector('.advantageDescription').textContent = advantage.description
        advantagesInner.appendChild(advantageItem)
    })
}
getAdvantages()