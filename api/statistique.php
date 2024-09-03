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
   
    // Fetch product data with category names
    
    $sql = $pdo->prepare('SELECT * from commerciale');
    $sql->execute();
    $sql1 = $pdo->prepare('SELECT * from vendeur');
    $sql1->execute();
    $sql2 = $pdo->prepare('
    SELECT
        c.*,
        COALESCE(SUM(cmd.montant_totale), 0) AS total_montant_totale
    FROM
        client c
    LEFT JOIN
        commande2 cmd ON c.id_client = cmd.id_client
    GROUP BY
        c.id_client, c.cin, c.nom, c.prenom, c.addresse, c.localisation, c.id_vendeur, c.id_commerciale, c.date_naissance');
    $sql2->execute();


    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    $responses=$sql1->fetchAll(PDO::FETCH_ASSOC);
    $responser=$sql2->fetchAll(PDO::FETCH_ASSOC);
    echo $responser;

  if(count($response)>0||count($responses)>0||count($responser)>0){
    // Encode and send the response
    echo json_encode(array('message'=>'got data','userData'=>$response,'userDatas'=>$responses,'userDatar'=>$responser));
  }else{
    echo json_encode(array('message'=>'nodata'));
  }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>