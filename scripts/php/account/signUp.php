<?
if (isset($_POST['login'])){

    require ('../modules.php'); //подключение модулей

    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) escape(false, 'none');
    }

    dbConnect(); //соединение с бд

    extract(getPosts());  //получение данных из массива POST
    $pass = password_hash($pass, PASSWORD_BCRYPT); //хэширование пароля

    loginAndMailCheck($login, $email); //проверка занятости логина и почты

    $sql = "INSERT INTO users(name, login, email, pass) VALUES ('$name', '$login', '$email', '$pass')"; //запись в бд
    sqlQueryCheck();

    $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //запрос в бд с целью получения id и роли нового пользователя
    sqlQueryCheck();

    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    extract(getSqlRowValues($rows[0])); //получение данных из массива rows

    if (isset($rememberUser)) ini_set('session.gc_maxlifetime', 604800); //установка времени жизни сессии на неделю
    else ini_set('session.gc_maxlifetime', 28800); //установка времени жизни сессии на 8 часов

    require('setSessionData.php'); //запись данных в сессию
    escape(true, 'success');
}