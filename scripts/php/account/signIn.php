<?
if (isset($_POST['login'])){

    include('../escape.php');

    $stat = false;
    $conn = new mysqli("localhost","root","","leafDB"); //соединение с бд
    if ($conn -> connect_error){
        $message = 'err1: '. $conn -> connect_error;
        Escape(false, $message);
    }

    $login = $conn -> real_escape_string($_POST["login"]);
    $pass = $conn -> real_escape_string($_POST["pass"]);

    $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //запрос в бд с проверкой на соответствие логина
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }

    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);

    if (mysqli_num_rows($result) == 0) { //проверка на наличие в бд записи с совпадающим логином
        Escape(false, 'wrong data');
    }

    if (password_verify($pass, $rows[0]['pass'])) { //проверка на соответствие хэшей введенного пароля и пароля из бд
        if (isset($_POST["rememberUser"])) ini_set('session.gc_maxlifetime', 604800); //установка времени жизни сессии на неделю
        else ini_set('session.gc_maxlifetime', 28800); //установка времени жизни сессии на 8 часов
        $id = $rows[0]['id'];
        $name = $rows[0]['name'];
        $email = $rows[0]['email'];
        $role = $rows[0]['role'];
        include('setSessionData.php'); //запись данных в сессию через скрипт из другого файла
        $stat = true;
        $message = 'none';
    }
    else {
        $stat = false;
        $message = 'wrong data';
    }
    
    Escape($stat, $message);
}