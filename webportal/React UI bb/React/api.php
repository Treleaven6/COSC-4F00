<?php
// this replicates a restful API
// look at the mail() function for password changes
// put #!/usr/bin/php-cgi at top (very top, before opening <?php) before uploading to Sandcastle
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	// handle get requests
    $out = shell_exec('python get.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// debugging
    //echo(json_encode($_POST));

	// get data
    $base64 = urldecode(file_get_contents("php://input"));

	// remove the leading "data:text/rtf;base64," etc.
	if (strpos($base64, ',') !== false) {
		$base64 = explode(',', $base64 );
		$base64 = $base64[1];
	}
	
	// parse out params from URL
	$params = explode('api.php', $_SERVER['REQUEST_URI']);
	$params = $params[1];
	$params = explode('/', $params);

	if ($params[1] === "upload") {
		// params[0] = ""
		// params[1] = "upload"
		// params[2] = cid (course id)
		// params[3] = aid (assignment id)
		// params[4] = sid (student id)
				
		// lookup or create fake student id
		$fake = shell_exec('python swapID.py ' . $_SERVER['REQUEST_URI']);
		$fake = str_replace('"', '', trim($fake)) . 'c' . $params[2] . 'a' . $params[3];

		// build path 
	    $path = 'uploads/'.$params[2].'/'.$params[3].'/target/'.$fake;

	    // ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path."/".$fake.'.zip', 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
	    shell_exec('python handle_upload.py ' . $_SERVER['REQUEST_URI'] . ' ' . $fake);

	    // return to React
	    echo(true);
	} else if ($params[1] === "uploadtest") {
		// params[0] = ""
		// params[1] = "upload"
		// params[2] = cid (course id)
		// params[3] = aid (assignment id)
		// params[4] = original zipfile name

		// build path 
	    $path = './uploads/'.$params[2].'/'.$params[3];

	    // ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path.'/'.urldecode($params[4]).".zip", 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
	    echo (shell_exec('python handle_test_upload.py ' . $_SERVER['REQUEST_URI']));

	    // return to React
	    //echo("baloney");
	} else if ($params[1] === "include") {
		// params[0] = ""
		// params[1] = "exclude"
		// params[2] = cid (course id)
		// params[3] = aid (assignment id)
		// params[4] = file name
		
		// build path
		$path = 'uploads/'.$params[2].'/'.$params[3].'/repository/singletons';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path."/".urldecode($params[4]), 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
	    // return dummy false
		echo(false);
	} else if ($params[1] === "includezip") {
		// build path
		$path = 'uploads/'.$params[2].'/'.$params[3].'/repository';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path."/".$params[4], 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 

	    // pass to python
	    echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	} else if ($params[1] === "exclude") {
		// params[0] = ""
		// params[1] = "exclude"
		// params[2] = cid (course id)
		// params[3] = aid (assignment id)
		// params[4] = file name
		
		// build path
		$path = 'uploads/'.$params[2].'/'.$params[3].'/ignore';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path."/".$params[4], 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
	    // return dummy true
		echo(true);
	} else if ($params[1] === "send") {
		// build path
		$path = './requests/';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// pass to python
		echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	} else if ($params[1] === "rminclude") {
		// build path
		$path = 'uploads/'.$params[2].'/'.$params[3].'/repository';
		// validate
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	} else if ($params[1] === "rmexclude") {
		// build path
		$path = 'uploads/'.$params[2].'/'.$params[3].'/ignore';
		// validate
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	} else {
		// see what python can do with it
		echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	}    
}
?>
