<?
if (isset($_POST['login'])){

    require ('../modules.php'); //подключение модулей

    dbConnect(); //соединение с бд

    extract(getPosts()); //получение данных из массива POST

    $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //запрос в бд с проверкой на соответствие логина
    sqlQueryCheck();

    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);

    if (mysqli_num_rows($result) == 0) escape(false, 'wrong data'); //проверка на наличие в бд записи с совпадающим логином
    
    if (password_verify($pass, $rows[0]['pass'])) { //проверка на соответствие хэшей введенного пароля и пароля из бд
        if (isset($rememberUser)) ini_set('session.gc_maxlifetime', 604800); //установка времени жизни сессии на неделю
        else ini_set('session.gc_maxlifetime', 28800); //установка времени жизни сессии на 8 часов

        extract(getSqlRowValues($rows[0])); //получение данных из массива rows

        require('setSessionData.php'); //запись данных в сессию
        escape(true, 'success');
    }
    else {
        escape(false, 'wrong data');
    }
}