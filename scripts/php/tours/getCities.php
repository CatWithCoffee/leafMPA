<?
include('../escape.php');

$conn = new mysqli("localhost","root","","leafDB"); //соединение с бд
if ($conn -> connect_error) {
    $message = 'err1: '. $conn -> connect_error;
    Escape(false, $message);
}

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if(isset($val['all'])) $sql = "SELECT * FROM cities ORDER BY ordersCount DESC LIMIT 6"; //запрос в бд зависит от конкретного случая
else $sql = "SELECT id, name FROM cities ORDER BY name"; 

$cities = array();
if ($result = $conn -> query($sql)) { //запись результата запроса в массив и его отправка
    $cities = $result -> fetch_all(MYSQLI_ASSOC);
    $result -> free();
    Escape(true, $cities);
}
else {
    $message = 'err2: '. $conn -> error;
    Escape(false, $message);
}