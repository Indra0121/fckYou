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
    
    $sql = $pdo->prepare('SELECT COUNT(id_bonvalider) as id_bonvalider from bonvalider');
    $sql->execute();
    $sql1 = $pdo->prepare('SELECT COUNT(id_commandevalider) as id_commande from commande2');
    $sql1->execute();
    $sql2 = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale from paiement');
    $sql2->execute();
    $sql3 = $pdo->prepare('SELECT SUM(montant_totale) as montant_totale from commandesachat');
    $sql3->execute();
    $sql4 = $pdo->prepare('SELECT * from paiement');
    $sql4->execute();
    $sql5 = $pdo->prepare('SELECT * from bonvalider');
    $sql5->execute();
    $response = $sql->fetchAll(PDO::FETCH_ASSOC);
    $responses=$sql1->fetchAll(PDO::FETCH_ASSOC);
    $responser=$sql2->fetchAll(PDO::FETCH_ASSOC);
    $responsed=$sql3->fetchAll(PDO::FETCH_ASSOC);
    $responsef=$sql4->fetchAll(PDO::FETCH_ASSOC);
    $responsee=$sql5->fetchAll(PDO::FETCH_ASSOC);

  if(count($response)>0||count($responses)>0||count($responser)>0||count($responsed)>0||count($responsef)>0){
    // Encode and send the response
    echo json_encode(array('message'=>'got data','userData'=>$response,'userDatas'=>$responses,'userDatar'=>$responser,'userDatad'=>$responsed,'userDataf'=>$responsef,'userDatae'=>$responsee));
  }else{
    echo json_encode(array('message'=>'nodata'));
  }

} catch (PDOException $e) {
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}






?>