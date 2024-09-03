<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try {
    $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get today's date
    $today = date('Y-m-d');
    
    // Prepare the SQL query to retrieve commandes where date_livraison is older than today and status is 0
    $sql = $pdo->prepare("SELECT * FROM commandesachat WHERE date_livraison < ? AND status = 0");
    $sql->execute([$today]);
    
    // Fetch the results
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    //get the data
     $sql1=$pdo->prepare("SELECT COUNT(id_commande) as commande,date_livraison FROM commande GROUP BY date_livraison ORDER BY date_livraison ASC");
     $sql1->execute();
     $responsed=$sql1->fetchAll(PDO::FETCH_ASSOC);
    // Check if any records were found
    if (count($response) > 0) {
        echo json_encode(array('message' => 'commandes retrieved', 'commandeenretard' => $response,'commandes'=>$responsed));
    } else {
        echo json_encode(array('message' => 'No commandes found'));
    }
} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>
