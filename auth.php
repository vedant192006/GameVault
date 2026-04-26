<?php
// auth.php – reusable authentication functions

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Verify reCAPTCHA response
 */
function verifyRecaptcha($response) {
    $secret = 'YOUR_SECRET_KEY'; // TODO: replace with actual secret key
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = http_build_query([
        'secret' => $secret,
        'response' => $response
    ]);
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => $data,
            'timeout' => 10
        ]
    ];
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === false) {
        return false;
    }
    $resultJson = json_decode($result, true);
    return $resultJson['success'] ?? false;
}

/**
 * Load users from JSON file
 */
function loadUsers() {
    $usersFile = __DIR__ . '/users.json';
    if (!file_exists($usersFile)) {
        return [];
    }
    $json = file_get_contents($usersFile);
    return json_decode($json, true) ?: [];
}

/**
 * Attempt login with email and password
 */
function attemptLogin($email, $password) {
    $users = loadUsers();
    foreach ($users as $user) {
        if (strcasecmp($user['email'], $email) === 0) {
            // Use PHP's password_verify (bcrypt)
            if (password_verify($password, $user['password'])) {
                // Login successful – store in session
                $_SESSION['user'] = $email;
                return true;
            }
        }
    }
    return false;
}

/**
 * Check if a user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user']);
}

/**
 * Get logged‑in user email
 */
function currentUser() {
    return $_SESSION['user'] ?? null;
}
?>
