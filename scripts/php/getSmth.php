<?
require ('modules.php'); //подключение модулей

dbConnect(); //соединение с бд

$accepted = file_get_contents('php://input');
$val = json_decode($accepted, true);

switch ($val['target']) { //в запросах передается 'цель' - от неё зависит запрос
    case 'countries':
        $sql = "SELECT id, name, description, image FROM countries ORDER BY id";
        break;
    case 'users':
        $sql = "SELECT id, role, name, login, email, ordersCount  FROM users ORDER BY id";
        break;
    case 'advantages':
        $sql = "SELECT name, description, image FROM advantages ORDER BY id"; 
        break;
    case 'tours':
        $sql = "SELECT cities.id, countries.name as country, cities.name, cities.description, ordersCount, cities.image FROM cities 
            LEFT JOIN countries ON cities.countryID = countries.id ORDER BY id";
        break;
    case 'cityCards':
        $sql = "SELECT name, description, image FROM cities ORDER BY id DESC LIMIT 3"; 
        break;
    case 'citySelect':
        $sql = "SELECT id, name FROM cities ORDER BY name"; 
        break;
    case 'popTours':
        $sql = "SELECT id, name, description, image FROM cities ORDER BY ordersCount DESC LIMIT 12";
        break;
    case 'aboutCards':
        $sql = "SELECT about.name, about.description, countries.image FROM about 
            LEFT JOIN countries ON about.id = countries.id ORDER BY about.id"; 
        break;
    case 'articleCards':
        getArticles();
        break;
    case 'userOrdersHistory':
        $userID = $val['id'];
        $sql = "SELECT orderDate, departurePoint, cities.name, departureDate, arriveDate, personsNumber, flightClass, noTransfers
            FROM ordersHistory LEFT JOIN cities ON arrivePoint_cityID = cities.id  WHERE userID = $userID ORDER BY ordersHistory.id DESC";
        break;
    case 'globalOrdersHistory':
        $sql = "SELECT userID, users.name as userName, orderDate, departurePoint, cities.name as arrivePoint, departureDate, arriveDate, personsNumber, flightClass, noTransfers
            FROM ordersHistory LEFT JOIN cities ON arrivePoint_cityID = cities.id  LEFT JOIN users ON userID = users.id ORDER BY ordersHistory.id";
        break;
    default: escape(false, 'unknown target');
}

function getArticles() {
    global $conn;
    $sql = "SELECT name, description FROM articleCards ORDER BY id LIMIT 2"; 
    $sql2 = "SELECT image FROM cities ORDER BY ordersCount DESC LIMIT 2";

    $articleCards = array();
    if ($result = $conn -> query($sql)) {
        $articleCards = $result -> fetch_all(MYSQLI_ASSOC);
        if ($result = $conn -> query($sql2)) {
            $articleImages = $result -> fetch_all(MYSQLI_ASSOC);
            foreach ($articleCards as $key => $value) {
                $articleCards[$key]['image'] = $articleImages[$key]['image'];
            }
            $result -> free();
            escape(true, $articleCards);
        }
    }
    else escape(false, $conn -> error);
}

escape(true, sqlSelect($sql)); //выполнение запроса и вывод результата в виде массива