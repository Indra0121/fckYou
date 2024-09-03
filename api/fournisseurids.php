<?php
try{
 $pdo = new PDO("mysql:host=localhost;dbname=logicom;charset=utf8", 'root', '');
 $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 $data = json_decode(file_get_contents("php://input"), true);
 $userid=$data['userid'];
//get the data
$sql1=$pdo->prepare("SELECT id_commandeachat FROM commandesachat where id_fournisseur=?");
 $sql1->execute([$userid]);
 $response=$sql1->fetchAll(PDO::FETCH_ASSOC);
if(count($response)>0){
    echo json_encode(array('message'=>'commandes retrieved','fournisseurids'=>$response));
}
}catch(PDOException $e){
    echo json_encode(array('error' => 'Database error: ' . $e->getMessage()));
}
?>