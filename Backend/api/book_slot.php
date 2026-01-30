<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['slot_id']) || !isset($data['name']) || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$slotId = $data['slot_id'];
$name = $data['name'];
$email = $data['email'];

try {
    $pdo->beginTransaction();

    // Check if slot is available (FOR UPDATE locks the row)
    $stmt = $pdo->prepare("SELECT is_booked FROM slots WHERE id = :id FOR UPDATE");
    $stmt->execute([':id' => $slotId]);
    $slot = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$slot) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'Slot not found']);
        exit;
    }

    if ($slot['is_booked']) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(['error' => 'Slot already booked']);
        exit;
    }

    // Book the slot
    $updateStmt = $pdo->prepare("UPDATE slots SET is_booked = 1 WHERE id = :id");
    $updateStmt->execute([':id' => $slotId]);

    // Create booking record
    $insertStmt = $pdo->prepare("INSERT INTO bookings (slot_id, name, email) VALUES (:slot_id, :name, :email)");
    $insertStmt->execute([
        ':slot_id' => $slotId,
        ':name' => $name,
        ':email' => $email
    ]);

    $pdo->commit();

    echo json_encode(['message' => 'Booking confirmed', 'booking_id' => $pdo->lastInsertId()]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
