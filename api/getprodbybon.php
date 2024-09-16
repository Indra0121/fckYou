<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // For GET requests, use $_GET instead of parsing the input
    $id = isset($_GET['idbon']) ? $_GET['idbon'] : null;

    if ($id === null) {
        throw new Exception('No idbon provided');
    }

    $sql = $pdo->prepare('SELECT id_commande FROM bonlivraison WHERE id_bonlivraison = ?');
    $sql->execute([$id]);
    $response = $sql->fetch(PDO::FETCH_ASSOC);

    if ($response === false) {
        echo json_encode(array('message' => 'No bonlivraison found for the given id'));
        exit;
    }

    $idv = $response['id_commande'];

    $sqll = $pdo->prepare('SELECT * FROM lignecommande WHERE id_commande = ?');
    $sqll->execute([$idv]);
    $responses = $sqll->fetchAll(PDO::FETCH_ASSOC);

    if (count($responses) > 0) {
        echo json_encode(array('message' => 'got data', 'userData' => $responses));
    } else {
        echo json_encode(array('message' => 'no data retrieved'));
    }

} catch (Exception $e) {
    echo json_encode(array('error' => $e->getMessage()));
}
?>