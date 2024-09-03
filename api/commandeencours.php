<?php
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific HTTP headers
header("Access-Control-Allow-Headers: Content-Type");

try{
 $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
 $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 //$data = json_decode(file_get_contents("php://input"), true);
//get the data
$today = date('Y-m-d');
$sql=$pdo->prepare("SELECT * from commandesachat WHERE date_livraison>? and status=0");
$sql->execute([$today]);
$response=$sql->fetchAll(PDO::FETCH_ASSOC);
if(count($response)>0){
    echo json_encode(array('message'=>'commandes retrieved','commandeencours'=>$response));
}
}catch(PDOException $e){
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>