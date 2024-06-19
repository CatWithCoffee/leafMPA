async function getAboutCards() { //получение информации для страницы "О нас"
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'aboutCards'}),
    })
    const data = await response.json()
    const aboutCards = data.message

    const aboutCardTemplate = document.getElementById('articleCardTemplate') //шаблон для карточек
    const articleCards = document.getElementById('articleCards') //контейнер для карточек

    aboutCards.forEach(aboutCard => { //создание и заполнение карточек информацией
        const articleCard = aboutCardTemplate.content.cloneNode(true)
        articleCard.querySelector('.articleCardLabel').textContent = aboutCard.name
        articleCard.querySelector('.articleCardDescription').innerHTML = aboutCard.description
        articleCard.querySelector('.articleCardImg').src = aboutCard.image
        articleCards.appendChild(articleCard)
    })
}
getAboutCards()