<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $pass = $data['password'];

    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    
    if ($domain == "comptable.com") {
        $sql = $pdo->prepare('SELECT * FROM comptable WHERE email=? and password=?');
    } elseif ($domain == "manager.com") {
        $sql = $pdo->prepare('SELECT * FROM manager WHERE email=? and password=?');
    } else {
        echo json_encode(array('error' => 'Invalid email domain or interface'));
        exit;
    }

    $sql->execute([$email, $pass]);
    $user = $sql->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(array('message' => 'Login successful', 'userData' => $user));
    } else {
        echo json_encode(array('error' => 'Invalid login credential'));
    }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
