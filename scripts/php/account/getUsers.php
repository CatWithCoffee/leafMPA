<?
include ('../escape.php');

$conn = new mysqli("localhost", "root", "", "leafDB"); //соединение с бд
if ($conn->connect_error) {
    $message = 'err1: ' . $conn->connect_error;
    Escape(false, $message);
}

$sql = "SELECT id, role, name, login, email, ordersCount  FROM users ORDER BY id";
if (!$conn->query($sql)) {
    $message = 'err2: ' . $conn->error;
    Escape(false, $message);
}

$users = array();
if ($result = $conn->query($sql)) { //запись результата запроса в массив и его отправка
    $users = $result->fetch_all(MYSQLI_ASSOC);
    $result->free();
    Escape(true, $users);
}