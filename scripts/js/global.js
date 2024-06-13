async function getSessionData(){ //получение данных сессии и занесение их в localStorage
    const response = await fetch('../scripts/php/getSessionData.php')
    const data = await response.json()
    // console.log(data)
    Object.keys(data).forEach((key, i) => {
        localStorage.setItem(key, Object.values(data)[i])
        // console.log(localStorage.getItem(key))
    });
}
function logged(){ //проверка авторизованности
    let result
    if(localStorage.getItem('auth') == 'true') result = true
    else result = false
    return result
}
export {getSessionData, logged}