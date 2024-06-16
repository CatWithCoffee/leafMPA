<?
include ('../escape.php');
session_start();

$conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
if ($conn -> connect_error) Escape(false, 'err1: '. $conn -> connect_error);

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if (isset($val['id'])){
    $id = $val['id'];
    $image = $val['image'];
    $sql = "DELETE FROM cities WHERE id = '$id'"; //удаление тура из бд
    if (!$conn -> query($sql)) Escape(false, 'err2: '. $conn -> error);

    if (unlink(getenv("DOCUMENT_ROOT").$image)) Escape(true, 'success'. getenv("DOCUMENT_ROOT").$image);
    else Escape(false, 'image not deleted'. getenv("DOCUMENT_ROOT").$image);
} 








