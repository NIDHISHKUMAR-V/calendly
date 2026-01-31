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

if (!isset($data['start_time']) || !isset($data['end_time'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing start_time or end_time']);
    exit;
}

$startTime = $data['start_time'];
$endTime = $data['end_time'];

try {
    // Overlap check
    $checkSql = "SELECT COUNT(*) FROM slots WHERE 
        (start_time < :end_time AND end_time > :start_time)";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([':start_time' => $startTime, ':end_time' => $endTime]);
    
    if ($checkStmt->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Slot overlaps with an existing slot']);
        exit;
    }

    $sql = "INSERT INTO slots (start_time, end_time) VALUES (:start_time, :end_time)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':start_time' => $startTime, ':end_time' => $endTime]);

    echo json_encode(['message' => 'Slot created successfully', 'id' => $pdo->lastInsertId()]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
