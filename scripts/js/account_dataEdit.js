import {getSessionData} from './global.js'

const personalDataInputs = document.querySelectorAll('.personalDataInput')
let identicalPasses = false
const updatedDataMessage = document.getElementById('updatedDataMessage')

function sideFunc(){ //заполнение атрибута value для проверки валидности через js
    personalDataInputs.forEach(inp => inp.value = localStorage.getItem(inp.classList[1]))
    personalDataInputs.forEach(input =>{
        input.addEventListener('input', () => {
            input.setAttribute('value', input.value)
        })
    })
    passesCheck()
}

function passesCheck(){ //проверка на идентичность введенных паролей 
    const newPersonalDataPasses = document.querySelectorAll('.personalDataInput.pass.new')
    newPersonalDataPasses.forEach(pass => { 
        pass.addEventListener('input', () => {
            if (newPersonalDataPasses[0].value == newPersonalDataPasses[1].value) {
                updatedDataMessage.textContent = ''  
                identicalPasses = true
            } 
            else if (newPersonalDataPasses[0].value == '' || newPersonalDataPasses[1].value == '') {}
            else if(newPersonalDataPasses[0].value != newPersonalDataPasses[1].value && 
                !newPersonalDataPasses[0].validity.patternMismatch && !newPersonalDataPasses[1].validity.patternMismatch){
                updatedDataMessage.textContent = 'Пароли не совпадают'
                identicalPasses = false
                return
            }
        })
    })
    submitFunc()
}

function submitFunc(){ //функционал формы обновления данных пользователя
    const personalDataSubmit = document.getElementById('personalDataSubmit')
    personalDataSubmit.addEventListener('click', async () => {
        let changed = false
        personalDataInputs.forEach((inp, i) => { //выяснение были ли изменены какие-либо поля (в ином случае кнопка отпраки данных не сработает)
            if (!inp.classList.contains('pass')){
                if (inp.value != localStorage.getItem(inp.classList[1])) changed = true
            }
            else if (inp.value != '') changed = true
        })
        if (!changed){
            console.log('nothing to change')
            return
        }

        let validated = true
        personalDataInputs.forEach(inp => { //проверка валидности полей ввода
            if(!validated) return
            if(inp.checkValidity()) {
                validated = true
            }
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
        });
        if(!validated) return

        const personalDataPasses = document.querySelectorAll('.personalDataInput.pass')
        let changedPassFields = 0
        personalDataPasses.forEach(pass => {if (pass.value != '') changedPassFields++}) //подсчёт заполненных полей ввода пароля

        const personalDataForm = document.getElementById('personalDataInner')
        const formData = new FormData(personalDataForm)
        
        if (changedPassFields > 0 && changedPassFields < 3) { //реакция на разное количество заполненных полей ввода пароля
            updatedDataMessage.textContent = 'Нужно заполнить все поля ввода пароля'
            setTimeout(() => updatedDataMessage.textContent = '', 2000)
            return
        }
        else if (changedPassFields == 0) { //если ни одно поле пароля не затронуто, они удаляются из формы
            personalDataPasses.forEach(pass => {
                formData.delete(pass.name)
            });
            identicalPasses = true
        }
        else {
            if (identicalPasses) formData.delete('newPassRep') //поле повторного ввода пароля отправлять не нужно
        }

        if (!validated || !identicalPasses) return //если что-то заполнено неправильно, форма не отправится

        formData.append('id', localStorage.getItem('id'))
        const response = await fetch('../scripts/php/account/editPersonalData.php', { //отправка запроса
            method: 'POST',
            body: formData
        })
        const data = await response.json()
        console.log(data)
        if (data.message == 'busyLogin') updatedDataMessage.textContent = 'Этот логин уже занят' //проверка ответа и реакция на него
        else if (data.message == 'busyEmail') updatedDataMessage.textContent = 'Эта почта уже занята'
        else if (data.message == 'wrongPass') updatedDataMessage.textContent = 'Неправильный старый пароль'
        else if (data.stat == true){
            getSessionData()
            personalDataPasses.forEach(pass => pass.value = '')
            updatedDataMessage.textContent = 'Данные обновлены'
            setTimeout(() => updatedDataMessage.textContent = '', 2000)
        }
        else updatedDataMessage.textContent = 'Неизвестная ошибка'
    })
}

export {sideFunc as dataEditFunc}