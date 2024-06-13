<?
if (isset($_POST['login'])){

    include('../escape.php');

    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) Escape(false, 'none');
    }

    $conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
    if ($conn -> connect_error){
        $message = 'err1: '. $conn -> connect_error;
        Escape(false, $message);
    }

    $name = $conn -> real_escape_string($_POST['name']);
    $login = $conn -> real_escape_string($_POST['login']);
    $email = $conn -> real_escape_string($_POST['email']);
    $pass = $conn -> real_escape_string($_POST['pass']);
    $pass = password_hash($pass, PASSWORD_BCRYPT); //хэширование пароля

    $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //поиск совпадения введенного логина и логинов в бд
    $result = $conn -> query($sql);
    if (mysqli_num_rows($result) > 0) {
        Escape(false, 'busyLogin');
    }
    $sql = "SELECT * FROM users WHERE email = '$email'"; //поиск совпадения введенного почтового адреса и почтовых адресов в бд
    $result = $conn -> query($sql);
    if (mysqli_num_rows($result) > 0) {
        Escape(false, 'busyEmail');
    }

    $sql = "INSERT INTO users(name, login, email, pass) VALUES ('$name', '$login', '$email', '$pass')"; //запись в бд
    if ($conn -> query($sql)) {

        $sql = "SELECT * FROM users WHERE BINARY login = '$login'"; //запрос в бд с целью получения id и роли нового пользователя
        if (!$conn -> query($sql)) {
            $message = 'err2: '. $conn -> error;
            $conn -> close();
            Escape(false, $message);
        }
        $result = $conn -> query($sql);
        $rows = $result -> fetch_all(MYSQLI_ASSOC);
        $id = $rows[0]['id'];
        $role = $rows[0]['role'];

        if (isset($_POST['rememberUser'])) ini_set('session.gc_maxlifetime', 604800); //установка времени жизни сессии на неделю
        else ini_set('session.gc_maxlifetime', 28800); //установка времени жизни сессии на 8 часов
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