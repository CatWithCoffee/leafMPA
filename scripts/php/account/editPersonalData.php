<?
if (isset($_POST['login'])){

    include('../escape.php');

    $conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
    if ($conn -> connect_error){
        $message = 'err1: '. $conn -> connect_error;
        Escape(false, $message);
    }

    $id = $conn -> real_escape_string($_POST['id']);
    $name = $conn -> real_escape_string($_POST['name']);
    $login = $conn -> real_escape_string($_POST['login']);
    $email = $conn -> real_escape_string($_POST['email']);

    session_start();
    if ($login != $_SESSION['login']){
        $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //поиск совпадения введенного логина и логинов в бд
        $result = $conn -> query($sql);
        if (mysqli_num_rows($result) > 0) {
            Escape(false, 'busyLogin');
        }
    }
    if ($email != $_SESSION['email']){
        $sql = "SELECT * FROM users WHERE email = '$email'"; //поиск совпадения введенного почтового адреса и почтовых адресов в бд
        $result = $conn -> query($sql);
        if (mysqli_num_rows($result) > 0) {
            Escape(false, 'busyEmail');
        }
    }
    
    $sql = "SELECT * FROM users WHERE id = '$id'"; //запрос в бд с целью получения роли и старого пароля пользователя
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }
    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    $role = $rows[0]['role'];

    if (isset($_POST['$oldPass'])){ //проверка решил ли пользователь сменить пароль
        $oldPass = $conn -> real_escape_string($_POST['oldPass']);
        $newPass = $conn -> real_escape_string($_POST['newPass']);
        if (!password_verify($oldPass, $rows[0]['pass'])){
            $conn -> close();
            Escape(false, 'wrongPass');
        }
        $newPass = password_hash($newPass, PASSWORD_BCRYPT); //хэширование пароля
        $sql = "UPDATE users SET name = '$name', login = '$login', email = '$email', pass = '$newPass' WHERE id = '$id'";
    }
    
    $sql = "UPDATE users SET name = '$name', login = '$login', email = '$email' WHERE id = '$id'";
    if ($conn -> query($sql)) {
        include('setSessionData.php'); //запись данных в сессию через скрипт из другого файла
        $stat = true;
        $message = 'none';
    }
    else {
        $stat = false;
        $message = 'err2: '. $conn -> error;
    }
    Escape($stat, $message);
}