<?
if (isset($_POST['userID'])){

    include('../escape.php');

    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) Escape(false, 'none');
    }

    $conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
    if ($conn -> connect_error){
        $message = 'err1: '. $conn -> connect_error;
        Escape(false, $message);
    }

    $userID = $conn -> real_escape_string($_POST['userID']);
    $departurePoint = $conn -> real_escape_string($_POST['departurePoint']);
    $arrivePoint_cityID = $conn -> real_escape_string($_POST['arrivePoint']);
    $departureDate = $conn -> real_escape_string($_POST['departureDate']);
    $arriveDate = $conn -> real_escape_string($_POST['arriveDate']);
    $personsNumber = $conn -> real_escape_string($_POST['personsNumber']);
    $flightClass = $conn -> real_escape_string($_POST['flightClass']);
    if (isset($_POST['noTransfers'])) $noTransfers = 1;
    else $noTransfers = 0;
    

    $sql = "INSERT INTO ordersHistory(userID, departurePoint, arrivePoint_cityID, departureDate, arriveDate, personsNumber, flightClass, noTransfers) 
    VALUES ('$userID', '$departurePoint', '$arrivePoint_cityID', '$departureDate', '$arriveDate', '$personsNumber', '$flightClass', '$noTransfers')"; //запись в бд

    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }

    session_start();
    $email = $_SESSION['email'];
    if($noTransfers) $ntrn = 'Без пересадок.';
    else $ntrn = '';
    
    $sql = "SELECT name FROM cities WHERE id = '$arrivePoint_cityID'";
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }
    $result = $conn -> query($sql);
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    $arrivePoint = $rows[0]['name'];
    
    $mailContent = 
    "<html><body>
        <b style='font-size: large;'>Здравствуйте</b>,<br>
        <div style='font-size: larger;'>Сообщаем, что ваш заказ прошёл успешно и сейчас находится в обработке.<br>
            Ниже вы можете проверить правильность указанных данных:
            <ul style='margin-top:0'>
                <li>Место вылета: $departurePoint.</li>
                <li>Место прибытия: $arrivePoint.</li>
                <li>Дата вылета: $departureDate.</li>
                <li>Дата возвращения: $arriveDate.</li>
                <li>Количество человек: $personsNumber.</li>
                <li>Класс перелёта: $flightClass.</li>
                <li>$ntrn</li>
            </ul>
        </div>
        <div>С уважением, <i style='text-decoration: underline; display: absolute; bottom: 0'>LeafAgency<i></div>
    </body></html>";

    $mailContent = wordwrap($mailContent, 70, "\r\n");
    $headers = "From: LeafProjectTest@outlook.com\r\n"
    ."Content-type: text/html; charset=utf-8\r\n"
    ."X-Mailer: PHP leafMPA script";
    $mail = mail($email, 'Новый заказ', $mailContent, $headers);
    if($mail) {
        $stat = true;
        $message = "mail sent";
    } 
    else {
        Escape(false, "mail not sent");
    } 

    $sql = "UPDATE cities SET ordersCount = ordersCount + 1 WHERE id = '$arrivePoint_cityID'";
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }
    $sql = "UPDATE users SET ordersCount = ordersCount + 1 WHERE id = '$userID'";
    if (!$conn -> query($sql)) {
        $message = 'err2: '. $conn -> error;
        Escape(false, $message);
    }

    Escape($stat, $message);
}