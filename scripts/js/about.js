async function getAboutCards() {
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'aboutCards'}),
    })
    const data = await response.json()
    const aboutCards = data.message

    const aboutCardTemplate = document.getElementById('articleCardTemplate')
    const articleCards = document.getElementById('articleCards')

    aboutCards.forEach(aboutCard => {
        const articleCard = aboutCardTemplate.content.cloneNode(true)
        articleCard.querySelector('.articleCardLabel').textContent = aboutCard.name
        articleCard.querySelector('.articleCardDescription').innerHTML = aboutCard.description
        articleCard.querySelector('.articleCardImg').src = aboutCard.image
        articleCards.appendChild(articleCard)
    })
}
getAboutCards()