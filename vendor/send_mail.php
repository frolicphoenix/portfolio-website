<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'autoload.php';

if (isset($_GET['mail'])) {

   #Cleaning Html,Script Tags and special characters
   function postTextClean($text) {
      $text            = trim(addslashes(htmlspecialchars(strip_tags($_POST[$text]))));
      return $text;
   }

   function getTextClean($text) {
      $text            = trim(addslashes(htmlspecialchars(strip_tags($_GET[$text]))));
      $search          = array('Ç','ç','Ğ','ğ','ı','İ','Ö','ö','Ş','ş','Ü','ü');
      $replace         = array('c','c','g','g','i','i','o','o','s','s','u','u');
      $new_text        = str_replace($search,$replace,$text);
      return $new_text;
   }

   $getActionURI       = getTextClean('mail');

   if($getActionURI ==="request") {
      #Let's get the data from the form   
      $contact_name     = postTextClean('contact_name');
      $contact_email    = postTextClean('contact_email');
      $contact_subject  = postTextClean('contact_subject');
      $contact_phone    = postTextClean('contact_phone');
      $contact_message  = postTextClean('contact_message'); 
      $mail_content     = "<h2>From</h2>
                           <p>{$contact_email}</p>
                           <h2>Name</h2>
                           <p>{$contact_name}</p>
                           <h2>Phone</h2>
                           <p>{$contact_phone}</p>
                           <h2>Subject</h2>
                           <p>{$contact_subject}</p>
                           <h2>Message</h2>
                           <p>".nl2br($contact_message)."</p>";

	  // Hosting SMTP Settings
	  $smtp_host        = 'smtp.example.com';                    // Enter the smtp server address you got from your hosting here
	  $smtp_port        = 465;                                 // TCP port to connect to
	  $smtp_username    = 'yoursmtpusername@example.com';           // SMTP username
	  $smtp_password    = 'yoursmtppassword';                        // SMTP password

      // Instantiation and passing `true` enables exceptions
      $mail = new PHPMailer(true);

      try {
         //Server settings
         $mail->isSMTP();                                                 
         $mail->SMTPAuth   = true;                        
         $mail->Host       = $smtp_host;                     
         $mail->Username   = $smtp_username;                   
         $mail->Password   = $smtp_password;               
         $mail->SMTPSecure = "ssl";
         $mail->Port       = $smtp_port;                                    
         $mail->CharSet    = "UTF-8";       
         $mail->SMTPAutoTLS = false;                        
         $mail->setFrom($smtp_username, $contact_subject);
         $mail->addAddress("yourmailaddress@example.com");            // Enter the email address you want to send here
         $mail->addReplyTo($contact_email, $contact_name);

         // Content
         $mail->isHTML(true);                                  
         $mail->Subject = $contact_subject;
         $mail->Body    = $mail_content;
         $mail->AltBody = strip_tags($mail_content);
         $mail->send();
         $message       = true;
         echo $message;   
      } catch (Exception $e) {
        $message       = false;
        echo $message;
        echo "Mailer Error: {$mail->ErrorInfo}";
      }
   }
}else {
   /* 
      This is if the incoming get parameter doesn't come by js, 
      this message will greet malicious software developers
   */
   echo "<div class='alert alert-danger'>You entered this area without permission.</div>";
}
?>