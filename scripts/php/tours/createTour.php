<?
require ('../modules.php'); //подключение модулей

if (isset($_POST['country'])){
    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) escape(false, 'empty field');
    }

    dbConnect(); //соединение с бд

    extract(getPosts()); //получение данных из массива POST
    $image = $_FILES['image'];
    
    $path = '/src/img/cities/'; //путь к папке с изображениями
    if(!is_dir($path)) mkdir($path, 0777, true);
    $extention = pathinfo($image['name'], PATHINFO_EXTENSION);
    $imageName = "$path".$name.".$extention"; //путь/имя.расширение

    if (move_uploaded_file($image['tmp_name'], getenv("DOCUMENT_ROOT").$imageName)) { //сохранение изображения
        $message = 'file uploaded';
        $sql = "INSERT INTO cities(countryID, name, description, image) VALUES ('$country', '$name', '$description', '$imageName')"; //добавление города в бд
        sqlQueryCheck();
        escape(true, 'success');
    }
    else escape(false, 'file not uploaded');
}
else escape(false, 'empty field');