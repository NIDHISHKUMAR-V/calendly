<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';


try {
    // Optional date filter: ?date=YYYY-MM-DD
    $dateFilter = isset($_GET['date']) ? $_GET['date'] : null;

    $sql = "SELECT id, start_time, end_time, is_booked FROM slots WHERE is_booked = 0";
    
    if ($dateFilter) {
        $sql .= " AND DATE(start_time) = :date";
    }
    
    $sql .= " ORDER BY start_time ASC";

    $stmt = $pdo->prepare($sql);
    
    if ($dateFilter) {
        $stmt->bindParam(':date', $dateFilter);
    }

    $stmt->execute();
    $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($slots);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
