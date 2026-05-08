<?php
// Just log that PayFast/Ozow notified
file_put_contents("notifications.log", json_encode($_POST) . PHP_EOL, FILE_APPEND);
http_response_code(200);
?>
