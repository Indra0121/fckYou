<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];
    $id = $data['userId']; // Assuming 'userId' is the parameter for the user's ID.

    $emailParts = explode('@', $email);
    $domain = strtolower($emailParts[1]);
    $sql = null;

    switch ($domain) {
        case "vendeur.com":
            $sql = $pdo->prepare('SELECT id_vendeur FROM vendeur WHERE email=? AND id_vendeur=?');
            break;
        case "commerciale.com":
            $sql = $pdo->prepare('SELECT id_commerciale FROM commerciale WHERE email=? AND id_commerciale=?');
            break;
        case "livreur.com":
            $sql = $pdo->prepare('SELECT id_livreur FROM livreur WHERE email=? AND id_livreur=?');
            break;
        case "comptable.com":
            $sql = $pdo->prepare('SELECT id_comptable FROM comptable WHERE email=? AND id_comptable=?');
            break;
        case "receptionist.com":
            $sql = $pdo->prepare('SELECT id_receptionniste FROM receptionniste WHERE email=? AND id_receptionniste=?');
            break;
        case "operateur.com":
            $sql = $pdo->prepare('SELECT id_operateur FROM operateur WHERE email=? AND id_operateur=?');
            break;
        case "achat.com":
            $sql = $pdo->prepare('SELECT id_achat FROM achat WHERE email=? AND id_achat=?');
            break;
        default:
            echo json_encode(array('success' => false));
            exit;
    }

    $sql->execute([$email, $id]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    $isSuccessful = count($response) > 0;

    echo json_encode(array('success' => $isSuccessful));

} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'error' => 'Database error: ' . $e->getMessage()));
}
?>