<?
require ('../modules.php'); //подключение модулей

dbConnect(); //соединение с бд

session_start();

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if (isset($val['id'])){ // аккаунт можно удалить на личной странице ч-з свой id в сессии, либо ч-з админ-панель, отправляя нужный id
    $id = $val['id'];
    if ($_SESSION['role'] != 'admin') escape(false, "you're not admin");
    if ($_SESSION['id'] == $id) escape(false, "nope");
} 
else {
    if ($_SESSION['role'] == 'admin') escape(false, "nope");
    $id = $_SESSION['id'];
    $_SESSION = [];
} 

sqlDelete('users', 'id', $id); //удаление пользователя

escape(true, 'user deleted');