import {getSessionData, logged} from './global.js'


const citySelect = document.getElementById('citySelect')
async function getCities(){ //получение списка доступных городов для select'а
    const response = await fetch('../scripts/php/tours/getCities.php')
    const data = await response.json()
    const cities = data.message

    cities.forEach(city => {
        citySelect.innerHTML += '<option value="' + city.id + '">' + city.name + '</option>'
    });
}
getCities()

const popTourTemplate = document.getElementById('popTourTemplate')
async function getPopTours(){
    const response = await fetch('../scripts/php/tours/getCities.php',{
        method: 'POST',
        body: JSON.stringify({'popTours': 1})
    })
    const data = await response.json()
    const cities = data.message
    const popularTours = document.getElementById('popularTours')

    cities.forEach(city => {
        const popTour = popTourTemplate.content.cloneNode(true)
        popTour.querySelector('.popTourLabel').textContent = city.name
        popTour.querySelector('.popTourDescription').textContent = city.description
        popTour.querySelector('.popTourImg').src = city.image
        popularTours.appendChild(popTour)
    })

    const popTours = document.querySelectorAll('.popTour')
    cities.forEach((city, i) => {
        popTours[i].addEventListener('click', () => {
            citySelect.value = city.id
        })
    }) 
}
getPopTours()

const inputs = document.querySelectorAll('.input')
const orderBtn = document.getElementById('orderBtn')
const resultMessage = document.getElementById('resultMessage')
getSessionData().then(() => { //проверка авторизованности
    if(logged()) tourOrder()
    else {
        inputs.forEach(inp => inp.disabled = true)
        orderBtn.disabled = true
        resultMessage.innerHTML = 'Сначала нужно <a href="account.html">войти в аккаунт</a>'
    } 
})

function setDateParams(){ //установка параметров полей выбора даты
    const departureDate = document.getElementById('departureDate')
    const arriveDate = document.getElementById('arriveDate')
    const date = new Date
    let yyyy = date.getFullYear()
    let mm = date.getMonth() + 1
    let dd = date.getDate()
    if (mm < 10) mm = '0' + mm
    if (dd < 10) dd = '0' + dd
    departureDate.min = yyyy + '-' + mm + '-' + dd
    departureDate.max = yyyy + 1 + '-' + mm + '-' + dd
    arriveDate.min = yyyy + '-' + mm + '-' + dd
    arriveDate.max = yyyy + 1 + '-' + mm + '-' + dd
    departureDate.addEventListener('input', () => arriveDate.min = departureDate.value)
}
setDateParams()

const personsNumber = document.getElementById('personsNumber')
personsNumber.addEventListener('input', () => {
    if(parseInt(personsNumber.value) > 10) {
        personsNumber.value = 10
        personsNumber.setCustomValidity('Количество человек не должно превышать 10')
        personsNumber.reportValidity()
        personsNumber.setCustomValidity('')
    } 
    else personsNumber.setCustomValidity('')
})

function tourOrder(){ //функционал формы заказа билетов    
    orderBtn.addEventListener('click', async () => {
        let validated = true

        inputs.forEach((inp, i) => { //проверка валидности полей ввода
            if(!validated) return
            if(inp.checkValidity()) {
                validated = true
            }
            // if(inp.value != '' && !inp.validity.patternMismatch && !inp.validity.typeMismatch && inp.validity. && inp.type != 'checkbox') {
            //     validated = true
            // }
            else if(inp.value == ''){
                inp.reportValidity()
                validated = false
                console.log('empty field')
                return
            }
            else{
                inp.reportValidity()
                validated = false
                console.log('incorrect data')
                return
            }
        })
        if(!validated) return
        console.log('all fields are validated')

        orderBtn.disabled = true
        const formData = new FormData(document.getElementById('orderForm'))
        formData.append('userID', localStorage.getItem('id'))
        const response = await fetch('../scripts/php/tours/createOrder.php', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()
        console.log(data)
        if (data.stat == true) resultMessage.textContent = 'Заказ успешно оформлен.'
        else resultMessage.textContent = 'Произошла ошибка. Попоробуйте позже.'
        orderBtn.disabled = false

    })
}