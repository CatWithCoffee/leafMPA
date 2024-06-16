<?
include('../escape.php');

$conn = new mysqli("localhost","root","","leafDB"); //соединение с бд
if ($conn -> connect_error) {
    $message = 'err1: '. $conn -> connect_error;
    Escape(false, $message);
}

$sql = "SELECT name, description FROM articleCards ORDER BY id LIMIT 2"; 
$sql2 = "SELECT image FROM cities ORDER BY ordersCount DESC LIMIT 2";

$articleCards = array();
if ($result = $conn -> query($sql)) { //запись результата запроса в массив и его отправка
    $articleCards = $result -> fetch_all(MYSQLI_ASSOC);
    if ($result = $conn -> query($sql2)) {
        $articleImages = $result -> fetch_all(MYSQLI_ASSOC);
        foreach ($articleCards as $key => $value) {
            $articleCards[$key]['image'] = $articleImages[$key]['image'];
        }
        $result -> free();
        Escape(true, $articleCards);
    }
    
}
else {
    $message = 'err2: '. $conn -> error;
    Escape(false, $message);
}
Escape(false, 'unk err');
