<?
include('escape.php');

$conn = new mysqli("localhost","root","","leafDB"); //соединение с бд
if ($conn -> connect_error) {
    $message = 'err1: '. $conn -> connect_error;
    Escape(false, $message);
}

$sql = "SELECT about.name, about.description, countries.image FROM about LEFT JOIN countries ON about.id = countries.id ORDER BY about.id"; 

$advantages = array();
if ($result = $conn -> query($sql)) { //запись результата запроса в массив и его отправка
    $advantages = $result -> fetch_all(MYSQLI_ASSOC);
    $result -> free();
    Escape(true, $advantages);
}
else {
    $message = 'err2: '. $conn -> error;
    Escape(false, $message);
}