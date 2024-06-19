<?
session_start();
$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);

if(isset($val['exit'])){ //очистка данных сессии
    $_SESSION = [];
}
else { //установка новых данных сессии
    foreach ($_POST as $key => $value) {
        $_SESSION[$key] = $value;
    }
}