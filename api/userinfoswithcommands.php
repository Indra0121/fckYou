<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $data = json_decode(file_get_contents("php://input"), true);
    $userid = $data['userid'];
    
    // Get user infos
    $sql = $pdo->prepare("SELECT nom, prenom, telephone_client FROM client WHERE id_client=?");
    $sql->execute([$userid]);
    $response = $sql->fetch(PDO::FETCH_ASSOC); // Fetch a single row instead of fetchAll

    // Get user commands
    $sql1 = $pdo->prepare("SELECT id_commande FROM commande WHERE id_client=?");
    $sql1->execute([$userid]);
    $commands = $sql1->fetchAll(PDO::FETCH_ASSOC);

    $usercommands = [];
    foreach ($commands as $row) {
        $getid = $row['id_commande'];
        $sql2 = $pdo->prepare("SELECT lc.id_commande as idcommande, lc.libeller as libeller, lc.prix as prix, lc.quantiter as quantiter, lc.tva as tva, lc.nom_categorie as nom_categorie, c.montant_totale as montant_totale 
                               FROM lignecommande lc 
                               JOIN commande c ON lc.id_commande = c.id_commande 
                               WHERE lc.id_commande = ?");
        $sql2->execute([$getid]);
        $responsess = $sql2->fetchAll(PDO::FETCH_ASSOC);
        foreach ($responsess as $lignecommande) {
            $usercommands[] = $lignecommande;
        }
    }

    echo json_encode(array('message' => 'All user data retrieved', 'userinfo' => $response, 'usercommands' => $usercommands));

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
