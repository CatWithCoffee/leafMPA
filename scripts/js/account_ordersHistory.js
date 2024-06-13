const ordersHistoryInner = document.getElementById('ordersHistoryInner')
function displayAccContent() {
    const sectionLabels = document.querySelectorAll('.sectionLabel')
    const arrows = document.querySelectorAll('.arrow')
    const sectionInners = document.querySelectorAll('.sectionInner')
    sectionLabels.forEach((section, i) => {
        section.addEventListener('click', () => {
            arrows[i].classList.toggle('shown')
            sectionInners[i].classList.toggle('shown')
        })
    })
    getOrdersHistory()
}

async function getOrdersHistory() {
    const response = await fetch('/scripts/php/account/getOrdersHistory.php', {
        method: 'POST',
        body: JSON.stringify({ 'id': localStorage.getItem('id') })
    })
    const data = await response.json()
    const orders = data.message

    let ordersArr = new Array
    orders.forEach(order => {
        let innerText = '<tr>'
        Object.keys(order).forEach((key, i) => {
            if (key == 'orderDate') innerText += '<td>' + Object.values(order)[i].split(' ')[0] + '</td>'
            else if (key == 'noTransfers') {
                if (Object.values(order)[i] == 0) innerText += '<td> </td>'
                else innerText += '<td>Без пересадок</td>'
            }
            else innerText += '<td>' + Object.values(order)[i] + '</td>'
        })
        innerText += '</tr>'
        ordersArr.push(innerText)
    })
    if (ordersArr.length == 0) {
        ordersHistoryInner.innerHTML = 'У вас пока нет заказов'
        ordersHistoryInner.style.maxHeight = 2 + 'vw'
        return
    }

    const rowsPerPage = 10
    let currentPage = 0

    const pagesCounter = document.querySelector('.pagesCounter')
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter))

    const previousPageBtn = document.querySelector('.previousPageBtn')
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter)
    })

    const nextPageBtn = document.querySelector('.nextPageBtn')
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter)
    })

    displayOrdersHistory(ordersArr, currentPage, rowsPerPage)
}

function setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter) {
    const minPage = 0
    const maxPage = Math.ceil(ordersArr.length / rowsPerPage)
    if (pagesCounter.value <= minPage) pagesCounter.value = minPage + 1
    else if (pagesCounter.value > maxPage) pagesCounter.value = maxPage
    else {
        currentPage = pagesCounter.value - 1
        displayOrdersHistory(ordersArr, currentPage, rowsPerPage)
    }
}

function displayOrdersHistory(ordersArr, currentPage, rowsPerPage) {
    const ordersHistoryBody = document.getElementById('ordersHistoryBody')
    ordersHistoryBody.innerHTML = ''
    if (ordersArr.length < rowsPerPage) ordersArr.forEach(order => ordersHistoryBody.innerHTML += order)
    else ordersArr.forEach((order, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) ordersHistoryBody.innerHTML += order
    })
}

export { displayAccContent as ordersHistoryFunc }