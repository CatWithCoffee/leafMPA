<?

//сюда вынесены повторяющиеся скрипты

function escape($stat, $message){ //функция для отправки ответа и завершения скрипта
    echo json_encode(array(
        'stat' => $stat,
        'message' => $message
    ));
    if (isset($conn)) $conn -> close();
    if (isset($result)) $result->free();
    die;
}

function dbConnect() { //соединение с бд
    global $conn;
    $conn = new mysqli("localhost","root","","leafDB"); 
    if ($conn -> connect_error) escape(false, 'err1: '. $conn -> connect_error);
}

function sqlQueryCheck(){ //выполнение запроса и его проверка
    global $conn;
    global $sql;
    if (!$conn -> query($sql)) {
        escape(false, $conn -> error);
    } 
}

function getPosts() { //получение данных из массива POST
    global $conn;
    $values = [];
    foreach ($_POST as $key => $value) {
        $values[$key] = $conn->real_escape_string($value);
    }
    return $values;
}

function getSqlRowValues($row) { //получение данных из массива row
    $values = [];
    foreach ($row as $key => $value) {
        $values[$key] = $value;
    }
    return $values;
}

function sqlSelect($sql) { //выполнение запроса и запись результата в массив
    global $conn;    
    $arr = array();
    if ($result = $conn -> query($sql)) { 
        $arr = $result->fetch_all(MYSQLI_ASSOC);
        return $arr;
    }
    else escape(false, $conn -> error);
}

function sqlDelete($table, $dbParam, $param) { //удаление записи из бд
    global $conn;
    $sql = sprintf("DELETE FROM %s WHERE %s = %s", $table, $dbParam, $param);
    if (!$conn->query($sql)) escape(false, 'not deleted: ' . $conn->error);
}