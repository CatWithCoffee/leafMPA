<?
include('../escape.php');

$conn = new mysqli("localhost","root","","leafDB"); //соединение с бд
if ($conn -> connect_error){
    $message = 'err1: '. $conn -> connect_error;
    Escape(false, $message);
}

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if (isset($val['id'])){
    $userID = $val['id'];
    $sql = "SELECT orderDate, departurePoint, cities.name, departureDate, arriveDate, personsNumber, flightClass, noTransfers
        FROM ordersHistory LEFT JOIN cities ON arrivePoint_cityID = cities.id  WHERE userID = $userID ORDER BY ordersHistory.id DESC";
} 
else $sql = "SELECT userID, users.name as userName, orderDate, departurePoint, cities.name as arrivePoint, departureDate, arriveDate, personsNumber, flightClass, noTransfers
    FROM ordersHistory LEFT JOIN cities ON arrivePoint_cityID = cities.id  LEFT JOIN users ON userID = users.id ORDER BY ordersHistory.id";

if (!$conn -> query($sql)) {
    $message = 'err2: '. $conn -> error;
    Escape(false, $message);
}

$orders = array();
if($result = $conn -> query($sql)){ //запись результата запроса в массив и его отправка
    $orders = $result -> fetch_all(MYSQLI_ASSOC);
    $result -> free();
    Escape(true, $orders);
}