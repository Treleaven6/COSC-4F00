
<?php
// put #!/usr/bin/php-cgi at top (very top, before opening <?php) before uploading to Sandcastle
// can start server locally by running "php -S localhost:8081"
// have to visit the website through this address!!!
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $out = shell_exec('python get.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// the file gets passed as a key for some reason
	$base64 = array_keys($_POST)[0];

	// automagically URI decoded?

	// remove the leading "data:text/rtf;base64," etc.
	if (strpos($base64, ',') !== false) {
		$base64 = explode(',', $base64 )[1];
	}

	// debugging
    //echo (json_encode($_POST));

	// params[0] = ""
	// params[1] = "api.php"
	// params[2] = "upload"
	// params[3] = cid (course id)
	// params[4] = aid (assignment id)
	// params[5] = sid (student id)
    $params = explode('/', $_SERVER['REQUEST_URI']);

    // ensure directory structure exists
	if (!file_exists('uploads/'.$params[3].'/'.$params[4])) {
		mkdir('uploads/'.$params[3].'/'.$params[4], 0777, true);
	}

	// open/create a file for writing binary
	$ifp = fopen('uploads/'.$params[3].'/'.$params[4].'/'.$params[5].'.zip', 'wb' ); 

    // write bytes to file
    fwrite( $ifp, base64_decode( $base64 ) );

    // clean up the file resource
    fclose( $ifp ); 

    // call a python script to handle updating mysql
    shell_exec('python post.py ' . $_SERVER['REQUEST_URI']);

    echo(true);
}
?>
