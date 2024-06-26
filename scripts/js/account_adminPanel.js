async function createTable(tableArr, rowsPerPage, navsCounter, tableBody, delFunc, toursImages) { //функция создания таблицы
    let currentPage = 0
    const pagesCounter = document.querySelectorAll('.pagesCounter')[navsCounter]
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => { //далее функционал элементов пагинации таблицы
        setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc, toursImages)
    })

    const previousPageBtn = document.querySelectorAll('.previousPageBtn')[navsCounter]
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc, toursImages)
    })

    const nextPageBtn = document.querySelectorAll('.nextPageBtn')[navsCounter]
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc, toursImages)
    })

    displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc, toursImages)
}
function setCurrentPage(tableArr, currentPage, rowsPerPage, pagesCounter, tableBody, delFunc, toursImages) { //установка текущей страницы
    const minPage = 0
    const maxPage = Math.ceil(tableArr.length / rowsPerPage)
    if (pagesCounter.value <= minPage) pagesCounter.value = 1
    else if (pagesCounter.value > maxPage) pagesCounter.value = maxPage
    else {
        currentPage = pagesCounter.value - 1
        displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc, toursImages)
    }
}

function displayPage(tableArr, currentPage, rowsPerPage, tableBody, delFunc, toursImages) { //отображение содержимого текущей страницы
    tableBody.innerHTML = ''
    if (tableArr.length < rowsPerPage) tableArr.forEach(elem => tableBody.innerHTML += elem)
    else tableArr.forEach((elem, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) {
            tableBody.innerHTML += elem
        } 
    })
    if (typeof delFunc == 'function') delFunc(toursImages, currentPage, rowsPerPage)
}

async function getUsers() { //получение информации о пользователях
    document.getElementById('usersList').style.display = 'flex'

    const response = await fetch('../scripts/php/getSmth.php', {
        method: 'POST',
        body: JSON.stringify({'target': 'users'})
    })
    const data = await response.json()
    const users = data.message

    let usersArr = new Array
    users.forEach(user => { //формирование таблицы
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

    createTable(usersArr, rowsPerPage, navsCounter, tableBody, delFunc)
    getOrdersHistory()
}

function deleteUser(){ //удаление пользователя через список админа
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
            if (data.message == 'user deleted') location.reload()
        })
    })
}

async function getOrdersHistory(){ //получение глобальной истории заказов
    document.getElementById('globalOrdersHistory').style.display = 'flex'

    const response = await fetch('../scripts/php/getSmth.php', {
        method: 'POST',
        body: JSON.stringify({'target': 'globalOrdersHistory'})
    })
    const data = await response.json()
    const orders = data.message

    let ordersArr = new Array
    orders.forEach(order => { //формирование таблицы
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

function createTour(){ //создание тура
    document.getElementById('toursList').style.display = 'flex'
    getCountriesOptions()

    const tourImagePreview = document.getElementById('tourImagePreview')
    const tourImageInput = document.querySelector('.tourInput.image')
    tourImageInput.addEventListener('input', () => {
        tourImagePreview.src = URL.createObjectURL(tourImageInput.files[0]) //предпросмотр выбранного изображения
    })

    const submitBtn = document.getElementById('toursListSubmit')
    const form = document.getElementById('toursListInner')
    const updatedDataMessage = document.getElementById('createTourMessage')

    submitBtn.addEventListener('click', async () => { //отправка новоиспеченного тура
        if (tourImagePreview.getAttribute('src') == "") return
        const response = await fetch('../scripts/php/tours/createTour.php', {
            method: 'POST',
            body: new FormData(form)
        })
        const data = await response.json()
        console.log(data.message)
        if (data.stat) { //чтение ответа и реакция
            form.reset()
            tourImagePreview.removeAttribute("src")
            updatedDataMessage.textContent = 'Тур добавлен'
            setTimeout(() => updatedDataMessage.textContent = '', 3000)
            setTimeout(() => getTours(), 1000)
        }
        else if (data.message == 'empty field') updatedDataMessage.textContent = 'Заполните все поля'
    })
    getTours()
}

async function getCountriesOptions(){ //получение списка стран для select'а
    const select = document.getElementById('countrySelect')
    const response = await fetch('../scripts/php/getSmth.php',{
        method: 'POST',
        body: JSON.stringify({'target': 'countries'}),
    })
    const data = await response.json()
    const countries = data.message

    countries.forEach((country, i) => select.innerHTML += `<option value="${country['id']}">${country['name']}</option>`)
}

async function getTours(){ //получение списка туров
    const response = await fetch('../scripts/php/getSmth.php', {
        method: 'POST',
        body: JSON.stringify({'target': 'tours'})
    })
    const data = await response.json()
    const tours = data.message

    const toursImages = tours.map(tour => tour.image)

    let toursArr = new Array
    tours.forEach(tour => { //формирование таблицы
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

    createTable(toursArr, rowsPerPage, navsCounter, tableBody, delFunc, toursImages)
}

function deleteTour(toursImages, page, rpp){ //удаление тура
    const deleteBtns = document.querySelectorAll('.deleteTour')

    deleteBtns.forEach((btn, i) => {
        let tourID = document.querySelectorAll('.tourID')
        btn.addEventListener('click', async () => {
            console.log(tourID[i].textContent)
            const response = await fetch('../scripts/php/tours/deleteTour.php', {
                method: 'POST',
                body: JSON.stringify({'id': tourID[i].textContent, 'image': toursImages[i + page * rpp]})
            })
            const data = await response.json()
            if (data.stat) location.reload()
            else console.log(data.message)
        })
    })
}
export { getUsers as adminPanelFunc }