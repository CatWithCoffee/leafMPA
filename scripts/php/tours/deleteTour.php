<?
require ('../modules.php'); //подключение модулей
session_start();

dbConnect(); //соединение с бд

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);
if (isset($val['id'])){
    $id = $val['id'];
    $image = $val['image'];

    sqlDelete('cities', 'id', $id); //удаление города из бд

    if (unlink(getenv("DOCUMENT_ROOT").$image)) escape(true, 'success'. getenv("DOCUMENT_ROOT").$image); //удаление изображения города
    else escape(false, 'image not deleted'. getenv("DOCUMENT_ROOT").$image);
} 








