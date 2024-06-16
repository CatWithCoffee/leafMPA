<?
if (isset($_POST['country'])){

    include('../escape.php');

    foreach($_POST as $elem){ //проверка на наличие пустых полей
        if (empty($elem)) Escape(false, 'empty field');
    }

    $conn = new mysqli('localhost','root',"","leafDB"); //соединение с бд
    if ($conn -> connect_error){
        $message = 'err1: '. $conn -> connect_error;
        Escape(false, $message);
    }

    $country = $conn -> real_escape_string($_POST['country']);
    $name = $conn -> real_escape_string($_POST['name']);
    $description = $conn -> real_escape_string($_POST['description']);
    $image = $_FILES['image'];
    
    $path = '/src/img/cities/';
    if(!is_dir($path)) mkdir($path, 0777, true);
    $extention = pathinfo($image['name'], PATHINFO_EXTENSION);
    $imageName = "$path".$name.".$extention";

    if (move_uploaded_file($image['tmp_name'], getenv("DOCUMENT_ROOT").$imageName)) {
        $message = 'file uploaded';
        $sql = "INSERT INTO cities(countryID, name, description, image) VALUES ('$country', '$name', '$description', '$imageName')";
        if ($conn -> query($sql)) Escape(true, 'success');
        else Escape(false, 'err2: '.$conn -> error);
    }
    else Escape(false, 'file not uploaded');
}