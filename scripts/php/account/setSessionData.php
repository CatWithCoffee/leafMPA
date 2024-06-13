<?
session_start();
$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);

if(isset($val['exit'])){ //очистка данных сессии
    $_SESSION = [];
}
else { //установка новых данных сессии
    $_SESSION['auth'] = true;
    $_SESSION['id'] = $id;
    $_SESSION['login'] = $login;
    $_SESSION['name'] = $name;
    $_SESSION['email'] = $email;
    $_SESSION['role'] = $role;
}