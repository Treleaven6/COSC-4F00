
<?php
// put #!/usr/bin/php-cgi at top before uploading to Sandcastle
// can start server locally by running "php -S localhost:8081"
// have to visit the website through this address!!!
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $out = shell_exec('python get.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// the file gets passed as a key for some reason
	$raw = array_keys($_POST)[0];

	// automagically URI decoded?

	// remove the leading "data:text/rtf;base64," etc.
	if (strpos($raw, ',') !== false) {
		$raw = explode(',', $raw )[1];
	}

	// debugging
    echo (json_encode($raw));

    // parse REQUEST_URI
    // create directory structure
    // replace file if already exists
    // call a python script to handle updating mysql?

	// open/create a file for writing binary
	$ifp = fopen('an_sid.zip', 'wb' ); 

    // write bytes to file
    fwrite( $ifp, base64_decode( $raw ) );

    // clean up the file resource
    fclose( $ifp ); 
}
?>
