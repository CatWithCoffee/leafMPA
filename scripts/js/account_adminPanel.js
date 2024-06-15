async function getUsers() {
    document.getElementById('usersList').style.display = 'flex'

    const response = await fetch('../scripts/php/account/getUsers.php')
    const data = await response.json()
    const users = data.message
    console.log(users)

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
    let currentPage = 0

    const pagesCounter = document.querySelectorAll('.pagesCounter')[1]
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => setCurrentUsersPage(usersArr, currentPage, rowsPerPage, pagesCounter))

    const previousPageBtn = document.querySelectorAll('.previousPageBtn')[1]
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentUsersPage(usersArr, currentPage, rowsPerPage, pagesCounter)
    })

    const nextPageBtn = document.querySelectorAll('.nextPageBtn')[1]
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentUsersPage(usersArr, currentPage, rowsPerPage, pagesCounter)
    })

    displayUsers(usersArr, currentPage, rowsPerPage)
}

function setCurrentUsersPage(usersArr, currentPage, rowsPerPage, pagesCounter) {
    const minPage = 0
    const maxPage = Math.ceil(usersArr.length / rowsPerPage)
    if (pagesCounter.value <= minPage) pagesCounter.value = minPage + 1
    else if (pagesCounter.value > maxPage) pagesCounter.value = maxPage
    else {
        currentPage = pagesCounter.value - 1
        displayUsers(usersArr, currentPage, rowsPerPage)
    }
}

function displayUsers(usersArr, currentPage, rowsPerPage) {
    const usersListBody = document.getElementById('usersListBody')
    usersListBody.innerHTML = ''
    if (usersArr.length < rowsPerPage) usersArr.forEach(order => usersListBody.innerHTML += order)
    else usersArr.forEach((order, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) {
            usersListBody.innerHTML += order
        } 
    })
    deleteUser(usersArr)
}

function deleteUser(usersArr){
    const deleteBtns = document.querySelectorAll('.deleteUser')
    console.log(deleteBtns)
    deleteBtns.forEach((btn, i) => {
        let userID  = document.querySelectorAll('.userID')
        btn.addEventListener('click', async () => {
            console.log(userID[i].textContent)
            const response = await fetch('../scripts/php/account/delete.php', {
                method: 'POST',
                body: JSON.stringify({'id': userID[i].textContent})
            })
            const data = await response.json()
            console.log(data.message)
            if (data.message == 'user deleted') getUsers() 
        })
    })
    getOrdersHistory()
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
    let currentPage = 0

    const pagesCounter = document.querySelectorAll('.pagesCounter')[2]
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter))

    const previousPageBtn = document.querySelectorAll('.previousPageBtn')[2]
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter)
    })

    const nextPageBtn = document.querySelectorAll('.nextPageBtn')[2]
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentOrdersPage(ordersArr, currentPage, rowsPerPage, pagesCounter)
    })

    displayOrdersHistory(ordersArr, currentPage, rowsPerPage)
    createTour()
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
    const ordersHistoryBody = document.getElementById('globalOrdersHistoryBody')
    ordersHistoryBody.innerHTML = ''
    if (ordersArr.length < rowsPerPage) ordersArr.forEach(order => ordersHistoryBody.innerHTML += order)
    else ordersArr.forEach((order, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) ordersHistoryBody.innerHTML += order
    })
}

async function getOptions(){
    const select = document.getElementById('countrySelect')
    const response = await fetch('../scripts/php/account/getCountries.php')
    const data = await response.json()
    const countries = data.message

    countries.forEach((country, i) => select.innerHTML += `<option value="${country['id']}">${country['name']}</option>`)
    console.log(countries[0]['name'])
}
function createTour(){
    document.getElementById('toursList').style.display = 'flex'
    getOptions()

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
            setTimeout(() => updatedDataMessage.textContent = '', 2000)
        }
    })
    getTours()
}

async function getTours(){
    const response = await fetch('../scripts/php/tours/getCities.php', {
        method: 'POST',
        body: JSON.stringify({'tours': 1})
    })
    const data = await response.json()
    const tours = data.message
    console.log(tours)

    let toursArr = new Array
    tours.forEach(tour => {
        let innerText = "<tr>"
        Object.keys(tour).forEach((key, i) => {
            if (key == 'id') innerText += '<td class = "tourID">' + Object.values(tour)[i] + '</td>'
            else if (key == 'image') innerText += '<td><img src="'+Object.values(tour)[i]+'" class="tourImage"></td>'
            else innerText += '<td>' + Object.values(tour)[i] + '</td>'
        })
        innerText += '<td> <button class="deleteTour">Удалить</button> </td>'
        innerText += '</tr>'
        toursArr.push(innerText)
    })

    const rowsPerPage = 3
    let currentPage = 0

    const pagesCounter = document.querySelectorAll('.pagesCounter')[3]
    pagesCounter.value = currentPage + 1
    pagesCounter.addEventListener('input', () => setCurrentToursPage(toursArr, currentPage, rowsPerPage, pagesCounter))

    const previousPageBtn = document.querySelectorAll('.previousPageBtn')[3]
    previousPageBtn.addEventListener('click', () => {
        pagesCounter.value--
        setCurrentToursPage(toursArr, currentPage, rowsPerPage, pagesCounter)
    })

    const nextPageBtn = document.querySelectorAll('.nextPageBtn')[3]
    nextPageBtn.addEventListener('click', () => {
        pagesCounter.value++
        setCurrentToursPage(toursArr, currentPage, rowsPerPage, pagesCounter)
    })

    displayTours(toursArr, currentPage, rowsPerPage)
}

function setCurrentToursPage(usersArr, currentPage, rowsPerPage, pagesCounter) {
    const minPage = 0
    const maxPage = Math.ceil(usersArr.length / rowsPerPage)
    if (pagesCounter.value <= minPage) pagesCounter.value = minPage + 1
    else if (pagesCounter.value > maxPage) pagesCounter.value = maxPage
    else {
        currentPage = pagesCounter.value - 1
        displayTours(usersArr, currentPage, rowsPerPage)
    }
}

function displayTours(usersArr, currentPage, rowsPerPage) {
    const toursListBody = document.getElementById('toursListBody')
    toursListBody.innerHTML = ''
    if (usersArr.length < rowsPerPage) usersArr.forEach(order => toursListBody.innerHTML += order)
    else usersArr.forEach((order, i) => {
        if (i >= currentPage * rowsPerPage && i < currentPage * rowsPerPage + rowsPerPage) {
            toursListBody.innerHTML += order
        } 
    })
}
export { getUsers as adminPanelFunc }