<?
include ('../escape.php');
session_start();

$conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
if ($conn -> connect_error){
    $message = 'err1: '. $conn -> connect_error;
    Escape(false, $message);
}

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if (isset($val['id'])){
    $id = $val['id'];
    $sql = "DELETE FROM cities WHERE id = '$id'"; //удаление тура из бд
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }
    else Escape(true, 'tour deleted');
} 








