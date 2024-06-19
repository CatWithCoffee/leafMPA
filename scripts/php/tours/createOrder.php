<?
if (isset($_POST['userID'])){

    require ('../modules.php'); //подключение модулей

    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) escape(false, 'none');
    }

    dbConnect(); //соединение с бд

    extract(getPosts()); //получение данных из массива POST
    if (isset($_POST['noTransfers'])) $noTransfers = 1;
    else $noTransfers = 0;
    
    

    $sql = "INSERT INTO ordersHistory(userID, departurePoint, arrivePoint_cityID, departureDate, arriveDate, personsNumber, flightClass, noTransfers) 
    VALUES ('$userID', '$departurePoint', '$arrivePoint', '$departureDate', '$arriveDate', '$personsNumber', '$flightClass', '$noTransfers')"; //запись заказа в бд
    sqlQueryCheck();

    session_start();
    $email = $_SESSION['email'];

    if($noTransfers) $noTransfers = 'Без пересадок.';
    else $noTransfers = '';
    
    $sql = "SELECT name FROM cities WHERE id = '$arrivePoint'"; //получение имени города (из формы приходит его id)
    sqlQueryCheck();

    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    $arrivePointName = $rows[0]['name'];
    
    $mailContent = //разметка письма
    "<html><body>
        <b style='font-size: large;'>Здравствуйте</b>,<br>
        <div style='font-size: larger;'>Сообщаем, что ваш заказ прошёл успешно и сейчас находится в обработке.<br>
            Ниже вы можете проверить правильность указанных данных:
            <ul style='margin-top:0'>
                <li>Место вылета: $departurePoint.</li>
                <li>Место прибытия: $arrivePointName.</li>
                <li>Дата вылета: $departureDate.</li>
                <li>Дата возвращения: $arriveDate.</li>
                <li>Количество человек: $personsNumber.</li>
                <li>Класс перелёта: $flightClass.</li>
                <li>$noTransfers</li>
            </ul>
        </div>
        <div>С уважением, <i style='text-decoration: underline; display: absolute; bottom: 0'>LeafAgency<i></div>
    </body></html>";

    $mailContent = wordwrap($mailContent, 70, "\r\n"); //форматирование письма (длина строки должна быть не более 70 символов)
    $headers = "From: LeafProjectTest@outlook.com\r\n" //заголовки письма
    ."Content-type: text/html; charset=utf-8";
    $mail = mail($email, 'Новый заказ', $mailContent, $headers);
    if($mail) {
        $stat = true;
        $message = "mail sent";
    } 
    else {
        escape(false, "mail not sent");
    } 

    $sql = "UPDATE cities SET ordersCount = ordersCount + 1 WHERE id = '$arrivePoint'"; //обновление счётчика заказов
    sqlQueryCheck();

    $sql = "UPDATE users SET ordersCount = ordersCount + 1 WHERE id = '$userID'"; //обновление счётчика заказов пользователя
    sqlQueryCheck();

    escape($stat, $message);
}