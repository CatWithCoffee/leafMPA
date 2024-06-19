<?
session_start();
$sessionData = [];
if (isset($_SESSION['auth'])){ //вывод текущих данных сессии
    foreach($_SESSION as $key => $value) {
        $sessionData[$key] = $value;
    }
    echo json_encode($sessionData); 
}
else echo json_encode(array(
    'auth' => null
));