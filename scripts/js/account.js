import { getSessionData, logged } from './global.js'
import { authFunc, deleteFunc, exitFunc, passSeekersFunc } from './account_auth.js'
import { ordersHistoryFunc } from './account_ordersHistory.js'
import { dataEditFunc } from './account_dataEdit.js'
import { adminPanelFunc } from './account_adminPanel.js'


const accContent = document.querySelector('.accContent')
getSessionData().then(() => { //проверка авторизованности для подготовки нужных функций
    if (logged()) {
        accContent.style.display = 'flex'
        accOffer.style.display = 'none'
        ordersHistoryFunc()
        dataEditFunc()
        exitFunc()

        localStorage.getItem('role') == 'admin' ? adminPanelFunc() : deleteFunc()
    }
    else {
        accContent.style.display = 'none'
        accOffer.style.display = 'flex'
        authFunc()
    }
    passSeekersFunc()
})

