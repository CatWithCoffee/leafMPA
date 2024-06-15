async function createTable(tableArr, rowsPerPage, navsCounter, tableBody, delFunc) {
    console.log(delFunc)
    let currentPage = 0
    const pagesCounter = document.querySelectorAll('.pagesCounter')[navsCounter]
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc))

    const previousPageBtn = document.querySelectorAll('.previousPageBtn')[navsCounter]
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc)
    })

    const nextPageBtn = document.querySelectorAll('.nextPageBtn')[navsCounter]
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc)
    })

    displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc)
}
function setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc) {
    const minPage = 0
    const maxPage = Math.ceil(tableArr.length / rowsPerPage)
    if (pagesCounter.value <= minPage) pagesCounter.value = minPage + 1
    else if (pagesCounter.value > maxPage) pagesCounter.value = maxPage
    else {
        currentPage = pagesCounter.value - 1
        displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc)
    }
}

function displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc) {
    tableBody.innerHTML = ''
    if (tableArr.length < rowsPerPage) tableArr.forEach(elem => tableBody.innerHTML += elem)
    else tableArr.forEach((elem, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) {
            tableBody.innerHTML += elem
        } 
    })
    if (typeof delFunc === 'function') delFunc()
}

async function getUsers() {
    document.getElementById('usersList').style.display = 'flex'

    const response = await fetch('../scripts/php/account/getUsers.php')
    const data = await response.json()
    const users = data.message

    let usersArr = new Array
    users.forEach(user => {
        let innerText = "<tr>"
        Object.keys(user).forEach((key, i) => {
            if (key == 'id') innerText += '<td class = "userID">' + Object.values(user)[i] + '</td>'
            else innerText += '<td>' + Object.values(user)[i] + '</td>'
        })
        innerText += '<td> <button class="deleteUser">Удалить</button> </td>'
        innerText += '</tr>'
        usersArr.push(innerText)
    })

    const rowsPerPage = 10
    const navsCounter = 1
    const tableBody = document.getElementById('usersListBody')
    const delFunc = deleteUser
    console.log(delFunc)

    createTable(usersArr, rowsPerPage, navsCounter, tableBody, delFunc)
    deleteUser()
    getOrdersHistory()
}

function deleteUser(){
    const deleteBtns = document.querySelectorAll('.deleteUser')
    deleteBtns.forEach((btn, i) => {
        let userID  = document.querySelectorAll('.userID')
        btn.addEventListener('click', async () => {
            console.log(userID[i].textContent)
            const response = await fetch('../scripts/php/account/deleteUser.php', {
                method: 'POST',
                body: JSON.stringify({'id': userID[i].textContent})
            })
            const data = await response.json()
            console.log(data.message)
            if (data.message == 'user deleted') location.reload() 
        })
    })
}

async function getOrdersHistory(){
    document.getElementById('globalOrdersHistory').style.display = 'flex'

    const response = await fetch('../scripts/php/account/getOrdersHistory.php', {
        method: 'POST',
        body: ''
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

    const rowsPerPage = 10
    const navsCounter = 2
    const tableBody = document.getElementById('globalOrdersHistoryBody')

    createTable(ordersArr, rowsPerPage, navsCounter, tableBody)
    createTour()
}

function createTour(){
    document.getElementById('toursList').style.display = 'flex'
    getCountriesOptions()

    const tourImagePreview = document.getElementById('tourImagePreview')
    const tourImageInput = document.querySelector('.tourInput.image')
    tourImageInput.addEventListener('input', () => {
        tourImagePreview.src = URL.createObjectURL(tourImageInput.files[0])
    })

    const submitBtn = document.getElementById('toursListSubmit')
    const form = document.getElementById('toursListInner')
    const updatedDataMessage = document.getElementById('updatedDataMessage')
    submitBtn.addEventListener('click', async () => {
        if (tourImagePreview.getAttribute('src') == "") return
        const response = await fetch('../scripts/php/tours/createTour.php', {
            method: 'POST',
            body: new FormData(form)
        })
        const data = await response.json()
        console.log(data.message)
        if (data.message == 'tour added') {
            form.reset()
            tourImagePreview.removeAttribute("src")
            updatedDataMessage.textContent = 'Тур добавлен'
            setTimeout(() => updatedDataMessage.textContent = '', 3000)
        }
    })
    getTours()
}
async function getCountriesOptions(){
    const select = document.getElementById('countrySelect')
    const response = await fetch('../scripts/php/account/getCountries.php')
    const data = await response.json()
    const countries = data.message

    countries.forEach((country, i) => select.innerHTML += `<option value="${country['id']}">${country['name']}</option>`)
}

async function getTours(){
    const response = await fetch('../scripts/php/tours/getCities.php', {
        method: 'POST',
        body: JSON.stringify({'tours': 1})
    })
    const data = await response.json()
    const tours = data.message

    let toursArr = new Array
    tours.forEach(tour => {
        let innerText = "<tr>"
        Object.keys(tour).forEach((key, i) => {
            if (key == 'id') innerText += '<td class = "tourID">' + Object.values(tour)[i] + '</td>'
            else if (key == 'image') innerText += '<td><img src="'+Object.values(tour)[i]+'" class="tourImage"></td>'
            else innerText += '<td>' + Object.values(tour)[i] + '</td>'
        })
        innerText += '<td> <button class="deleteTour" onclick="event.preventDefault();">Удалить</button> </td>'
        innerText += '</tr>'
        toursArr.push(innerText)
    })
    const rowsPerPage = 3
    const navsCounter = 3
    const tableBody = document.getElementById('toursListBody')
    const delFunc = deleteTour

    createTable(toursArr, rowsPerPage, navsCounter, tableBody, delFunc)
    deleteTour()
}

function deleteTour(){
    const deleteBtns = document.querySelectorAll('.deleteTour')
    deleteBtns.forEach((btn, i) => {
        let tourID  = document.querySelectorAll('.tourID')
        btn.addEventListener('click', async () => {
            const response = await fetch('../scripts/php/tours/deleteTour.php', {
                method: 'POST',
                body: JSON.stringify({'id': tourID[i].textContent})
            })
            const data = await response.json()
            if (data.stat) location.reload()
            else console.log(data.message)
        })
    })
}
export { getUsers as adminPanelFunc }