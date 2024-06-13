<?
function Escape($stat, $message){ //функция для отправки ответа и завершения скрипта
    echo json_encode(array(
        'stat' => $stat,
        'message' => $message
    ));
    if (isset($conn)) $conn -> close();
    die;
}