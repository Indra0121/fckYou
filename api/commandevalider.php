<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // get the data
    $today = date('Y-m-d');
    $sql = $pdo->prepare("SELECT * FROM commandesachat WHERE status=1");
    $sql->execute();

    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    if (count($response) > 0) {
        echo json_encode(array('message' => 'commandes retrieved', 'commandevalider' => $response));
    } else {
        echo json_encode(array('message' => 'No commandes found'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
