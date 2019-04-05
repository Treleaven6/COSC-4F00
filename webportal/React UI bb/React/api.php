<?php
// look at the mail() function for password changes
// put #!/usr/bin/php-cgi at top (very top, before opening <?php) before uploading to Sandcastle
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $out = shell_exec('python get.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// debugging
    //echo(json_encode($_POST));

    $base64 = urldecode(file_get_contents("php://input"));

	// remove the leading "data:text/rtf;base64," etc.
	if (strpos($base64, ',') !== false) {
		$base64 = explode(',', $base64 );
		$base64 = $base64[1];
	}
	
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
		$fake = trim($fake) . 'c' . $params[2] . 'a' . $params[3];

		// build path 
	    $path = 'uploads/'.$params[2].'/'.$params[3].'/target/'.$fake;

	    // ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// erase current contents
		//shell_exec("rm ".$dir_path." -R");
		// should actually upload to a random directory name,
		// save the sid -> dirname in a file,
		// and only then delete old directory

		// open/create a file for writing binary
		$ifp = fopen($path."/".$fake.'.zip', 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 

	    // call a python script to handle updating mysql
	    //shell_exec('python post.py ' . $_SERVER['REQUEST_URI']);

	    // call a python script to anonymize the files
	    //shell_exec('python strip_files.py ' . $_SERVER['REQUEST_URI']);
	    
	    shell_exec('python handle_upload.py ' . $_SERVER['REQUEST_URI'] . ' ' . $fake);

	    // return to React
	    echo(true);
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
		$ifp = fopen($path."/".$params[4], 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
		echo(false);
	} else if ($params[1] === "includezip") {
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

	    echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	    
		//echo(false);
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
	    
		echo(true);
	} else if ($params[1] === "send") {
		$path = './requests/';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	} else if ($params[1] === "rminclude") {
		$path = 'uploads/'.$params[2].'/'.$params[3].'/repository';
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	} else if ($params[1] === "rmexclude") {
		$path = 'uploads/'.$params[2].'/'.$params[3].'/ignore';
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	} else {
		echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	}    
}
?>
