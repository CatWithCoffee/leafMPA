<?
include ('../escape.php');

$conn = new mysqli("localhost", "root", "", "leafDB"); //соединение с бд
if ($conn->connect_error) {
    $message = 'err1: ' . $conn->connect_error;
    Escape(false, $message);
}

$sql = "SELECT id, name  FROM countries ORDER BY name";
if (!$conn->query($sql)) {
    $message = 'err2: ' . $conn->error;
    Escape(false, $message);
}

$countries = array();
if ($result = $conn->query($sql)) { //запись результата запроса в массив и его отправка
    $countries = $result->fetch_all(MYSQLI_ASSOC);
    $result->free();
    Escape(true, $countries);
}