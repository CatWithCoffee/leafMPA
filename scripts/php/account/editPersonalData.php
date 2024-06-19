<?
if (isset($_POST['login'])){

    require ('../modules.php'); //подключение модулей

    dbConnect(); //соединение с бд

    extract(getPosts()); //получение данных из массива POST

    session_start();

    loginAndMailCheck($login, $email); //проверка занятости логина и почты
    
    $sql = "SELECT * FROM users WHERE id = '$id'"; //запрос в бд с целью получения роли и старого пароля пользователя
    sqlQueryCheck();

    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    $role = $rows[0]['role'];

    if (isset($_POST['$oldPass'])){ //проверка решил ли пользователь сменить пароль
        $oldPass = $conn -> real_escape_string($_POST['oldPass']);
        $newPass = $conn -> real_escape_string($_POST['newPass']);
        if (!password_verify($oldPass, $rows[0]['pass'])) escape(false, 'wrongPass');

        $newPass = password_hash($newPass, PASSWORD_BCRYPT); //хэширование пароля
        $sql = "UPDATE users SET name = '$name', login = '$login', email = '$email', pass = '$newPass' WHERE id = '$id'";
    }
    else $sql = "UPDATE users SET name = '$name', login = '$login', email = '$email' WHERE id = '$id'"; //обновление данных пользователя

    sqlQueryCheck();
    require ('setSessionData.php'); //запись данных в сессию
    escape(true, 'success');

}