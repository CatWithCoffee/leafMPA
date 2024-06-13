<?
session_start();
if (isset($_SESSION['auth'])) echo json_encode(array( //вывод текущих данных сессии
    'auth' => $_SESSION['auth'],
    'id' => $_SESSION['id'],
    'login' => $_SESSION['login'],
    'name' => $_SESSION['name'],
    'email' => $_SESSION['email'],    
    'role' => $_SESSION['role']
));
else echo json_encode(array( //вывод текущих данных сессии
    'auth' => null
));