const signInForm = document.getElementById('signIn')
const signUpForm = document.getElementById('signUp')

function sideFunc(){// функция со вспомогательными действиями
    const signInBtns = document.querySelectorAll('.signInBtn')
    const accOffer = document.getElementById('accOffer')
    signInBtns.forEach(btn =>{// переключение отображения блоков аутентификации
        btn.addEventListener('click', () => {
            accOffer.style.display = 'none'
            signInForm.style.display = 'flex'
            signUpForm.style.display = 'none'
        })
    });
    const signUpBtns = document.querySelectorAll('.signUpBtn')
    signUpBtns.forEach(btn =>{// переключение отображения блоков аутентификации
        btn.addEventListener('click', () => {
            accOffer.style.display = 'none'
            signInForm.style.display = 'none'
            signUpForm.style.display = 'flex' 
        })
    });

    const inputs = document.querySelectorAll('.input')
    inputs.forEach(input =>{ //заполнение атрибута value для проверки валидности через js
        input.addEventListener('input', () => {
            input.setAttribute('value', input.value)
        })
    })
    signIn()
}

function signIn(){ //вход
    const signInSubmitBtn = document.getElementById('signInSubmitBtn')
    const signInInputs = document.querySelectorAll('.signIn')
    signInSubmitBtn.addEventListener('click', async () =>{ //функция авторизации
        let validated = true
        signInInputs.forEach(inp => { //проверка валидности полей ввода
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

        const wrongSignInData = document.getElementById('wrongSignInData')
        const response = await fetch('/scripts/php/account/signIn.php', { //отправка запроса
            method: 'POST',
            body: new FormData(signInForm)
        })
        const data = await response.json()
        console.log(data.stat)
        console.log(data.message)
        if(data.stat == true) location.reload() //проверка ответа и реакция на него
        else if (data.stat == false) wrongSignInData.textContent = 'Неверный логин или пароль'
    })
    signUp()
}

function signUp(){ //регистрация
    const signUpInputs = document.querySelectorAll('.signUp')
    const signUpPasses = document.querySelectorAll('.signUp.pass')
    const passErrMessage = document.getElementById('passErrMessage')
    let identicalPasses = false
    signUpPasses.forEach(pass => { //проверка на идентичность введенных паролей 
        pass.addEventListener('input', () => {
            console.log('inp')
            if (signUpPasses[0].value == signUpPasses[1].value) {
                passErrMessage.style.display = 'none'  
                identicalPasses = true
            }
            else if (signUpPasses[0].value == '' || signUpPasses[1].value == '') passErrMessage.style.display = 'none'
            else if(signUpPasses[0].value != signUpPasses[1].value && !signUpPasses[0].validity.patternMismatch && !signUpPasses[1].validity.patternMismatch){
                passErrMessage.style.display = 'block'
                identicalPasses = false
                return
            }
        })
    })

    const signUpSubmitBtn = document.getElementById('signUpSubmitBtn')
    signUpSubmitBtn.addEventListener('click', async () => { //функция регистрации
        let validated = true
        signUpInputs.forEach((inp, i) => { //проверка валидности полей ввода
            if(!validated) return
            if(inp.value != '' && !inp.validity.patternMismatch && !inp.validity.typeMismatch && inp.type != 'checkbox') {
                validated = true
            }
            else if(inp.validity.patternMismatch || inp.validity.typeMismatch){
                inp.reportValidity()
                validated = false
                console.log('incorrect data')
                return
            }
            else if(inp.value == ''){
                inp.reportValidity()
                validated = false
                console.log('empty field')
                return
            }
        })

        console.log(validated)
        console.log(identicalPasses)
        if(validated && identicalPasses) { //проверка чекбокса после заполнения всех полей ввода
            signUpPasses[1].setCustomValidity('')
            let checkbox = document.querySelector('.checkbox.signUp')
            if (!checkbox.checked) {
                checkbox.reportValidity()
                console.log('not checked checkbox')
                return
            }
        }
        else if(validated && !identicalPasses) { //сообщение для пользователя при неидентичных паролях
            signUpPasses[1].setCustomValidity('Пароли должны совпадать')
            signUpPasses[1].reportValidity()
        }
        if (!validated || !identicalPasses) return

        const wrongSignUpData = document.querySelector('#wrongSignUpData')
        const response = await fetch('/scripts/php/account/signUp.php', { //отправка запроса
            method: 'POST',
            body: new FormData(signUpForm)
        })
        const data = await response.json()
        console.log(data.stat)
        console.log(data.message)
        if(data.stat == true) location.reload() //проверка ответа и реакция на него
        else if (data.message == 'busyLogin') wrongSignUpData.textContent = 'Логин уже занят' 
        else if (data.message == 'busyEmail') wrongSignUpData.textContent = 'Почта уже занята' 
        else if (data.stat == false) wrongSignUpData.textContent = 'Ошибка регистрации'
    })
}

const exitLink = document.getElementById('exitLink')
function exit(){ //функционал кнопки выхода из аккаунта
    exitLink.addEventListener('click', async (e) => { 
        e.preventDefault()
        localStorage.clear()
        const sBody = { 'exit': 1 } 
        await fetch('/scripts/php/account/setSessionData.php', {
            method: 'POST',
            body: JSON.stringify(sBody),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        location.reload()
    })
}
function deleteAcc(){ //функционал кнопки удаления аккаунта
    const accContent = document.querySelector('.accContent')
    const deleteLink = document.getElementById('deleteLink')

    deleteLink.addEventListener('click', async (e) => { 
        e.preventDefault()
        const confirmElem = document.createElement('div')
        confirmElem.id = 'confitmElem'
        confirmElem.innerHTML = "Вы уверены? Это действие навсегда удалит все ваши данные."+
        "<div id = 'confirmInner'><a href = '' id = 'delete'>Да</a><a href = '' id = 'doNotDelete'>Нет</a></div>"
        
        deleteLink.style.display = 'none'
        exitLink.style.display = 'none'
        accContent.appendChild(confirmElem)

        const doNotDelete = document.getElementById('doNotDelete')
        doNotDelete.addEventListener('click', (e) => {
            e.preventDefault()
            confirmElem.remove()
            deleteLink.style.display = 'block'
            exitLink.style.display = 'block'
        })
        
        const deleteConfirm = document.getElementById('delete')
        deleteConfirm.addEventListener('click', async (e) => { 
            e.preventDefault()
            localStorage.clear()
            const response = await fetch('/scripts/php/account/delete.php', {
                method: 'POST',
                body: '',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            location.reload()
        })
    })
    
}

function passVisibilityToggle(){ //переключение видимости пароля в полях ввода
    const passSeekers = document.querySelectorAll('.passSeeker')
    const passes = document.querySelectorAll('.pass')
    passSeekers.forEach((seeker, i) => {
        seeker.addEventListener('click', () =>{
            if (passes[i].getAttribute('type') == 'password'){
                seeker.setAttribute('src', '../src/svg/visibility_off.svg')
                passes[i].setAttribute('type', 'text')
            }
            else{
                seeker.setAttribute('src', '../src/svg/visibility.svg')
                passes[i].setAttribute('type', 'password')
            }
        })
    })
}

export {
    sideFunc as authFunc, 
    exit as exitFunc, 
    deleteAcc as deleteFunc, 
    passVisibilityToggle as passSeekersFunc
}