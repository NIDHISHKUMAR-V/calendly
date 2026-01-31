<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['slot_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing slot_id']);
    exit;
}

$slotId = $data['slot_id'];

try {
    $sql = "DELETE FROM slots WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $slotId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['message' => 'Slot deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Slot not found']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
