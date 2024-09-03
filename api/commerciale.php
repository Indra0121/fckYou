<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = $pdo->prepare('SELECT * FROM commerciale');
    $sql->execute();

    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    if (count($response) > 0) {
        // Encode and send the response
        echo json_encode(array('message' => 'got data', 'userData' => $response));
    } else {
        echo json_encode(array('message' => 'nodata'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
