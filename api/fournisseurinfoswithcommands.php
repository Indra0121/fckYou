<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if user_id is set in the received data
    if (!isset($data['user_id'])) {
        echo json_encode(array('error' => 'Missing user_id in request data'));
        exit();
    }

    $userid = $data['user_id'];

    // Get user infos
    $sql = $pdo->prepare("SELECT nom_entreprise, telephone_contact,email_contact FROM fournisseur WHERE id_fournisseur = ?");
    $sql->execute([$userid]);
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);

    // Get his commands
    $sql1 = $pdo->prepare("SELECT id_commandeachat FROM commandesachat WHERE id_fournisseur = ?");
    $sql1->execute([$userid]);
    $responses = $sql1->fetchAll(PDO::FETCH_ASSOC);

    $usercommands = [];
    foreach ($responses as $row) {
        $getid = $row['id_commandeachat'];
        $sql2 = $pdo->prepare("SELECT lc.id_commandeachat AS idcommande, lc.libeller AS libeller, lc.prix AS prix, lc.quantiter AS quantiter, lc.tva AS tva, lc.nom_categorie AS nom_categorie, c.montant_totale AS montant_totale FROM lignecommandeachat lc, commandesachat c WHERE lc.id_commandeachat = ? AND lc.id_commandeachat = c.id_commandeachat");
        $sql2->execute([$getid]);
        $responsess = $sql2->fetchAll(PDO::FETCH_ASSOC);
        foreach ($responsess as $lignecommande) {
            $usercommands[] = $lignecommande;
        }
    }

    echo @json_encode(array('message' => 'All user data retrieved', 'userinfos' => $response, 'usercommands' => $usercommands));

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>