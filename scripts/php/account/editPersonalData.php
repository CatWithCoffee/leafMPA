<?
if (isset($_POST['login'])){

    require ('../modules.php'); //подключение модулей

    dbConnect(); //соединение с бд

    extract(getPosts()); //получение данных из массива POST

    session_start();

    $sql = "SELECT * FROM users WHERE BINARY login = '$login' OR email = '$email'"; //проверка занятости логина и почты
    $result = $conn -> query($sql);
    if ($result -> num_rows > 0) {
        foreach ($result as $row) {
            if ($login != $_SESSION['login'] && $row['login'] == $login) {
                escape(false, 'busyLogin');
            }
            if ($email != $_SESSION['email'] && $row['email'] == $email) {
                escape(false, 'busyEmail');
            }
        }
    }
    
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