<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (json_last_error() === JSON_ERROR_NONE && isset($data['id_commandeachat'])) {
        $getid = $data['id_commandeachat'];

        $sql2 = $pdo->prepare("SELECT lc.id_commandeachat as idcommande, lc.libeller as libeller, lc.prix as prix, lc.quantiter as quantiter, lc.tva as tva, lc.nom_categorie as nom_categorie, c.montant_totale as montant_totale 
                               FROM lignecommandeachat lc
                               JOIN commandesachat c ON lc.id_commandeachat = c.id_commandeachat
                               WHERE lc.id_commandeachat = :id_commandeachat");
        $sql2->execute(['id_commandeachat' => $getid]);

        $responses = $sql2->fetchAll(PDO::FETCH_ASSOC);

        if (count($responses) > 0) {
            echo json_encode(['message' => 'All user data retrieved', 'usercommands' => $responses]);
        } else {
            echo json_encode(['message' => 'No data found']);
        }
    } else {
        echo json_encode(['error' => 'Invalid input']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
