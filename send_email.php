<?php
// Check if the form was submitted using POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $interest = htmlspecialchars($_POST['interest']);
    $experience = htmlspecialchars($_POST['experience']);
    $message = htmlspecialchars($_POST['message']);

    // Validate required fields
    if (empty($name) || empty($email) || empty($interest)) {
        echo "Error: Please fill out all required fields.";
        exit;
    }

    // Set up email details
    $to = "govind.kotecha@gmail.com"; // Replace with your email address
    $subject = "New Course Inquiry from $name";
    $body = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Primary Interest: $interest\n";
    $body .= "Investment Experience: $experience\n";
    $body .= "Message: $message\n";

    $headers = "From: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you, $name! Your request has been submitted successfully.";
    } else {
        echo "Error: Unable to send the email. Please try again later.";
    }
} else {
    echo "Invalid request method.";
}
?>