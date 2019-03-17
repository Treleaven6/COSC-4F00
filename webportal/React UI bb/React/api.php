
<?php
// put #!/usr/bin/php-cgi at top (very top, before opening <?php) before uploading to Sandcastle
// can start server locally by running "php -S localhost:8081"
// have to visit the website through this address!!!
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $out = shell_exec('python get.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// debugging
    //echo (json_encode($_POST));
    
	// the file gets passed as a key for some reason
	$base64 = array_keys($_POST);
	$base64 = $base64[0];

	// automagically URI decoded?

	// remove the leading "data:text/rtf;base64," etc.
	if (strpos($base64, ',') !== false) {
		$base64 = explode(',', $base64 );
		$base64 = $base64[1];
	}

	// THIS NEEDS TO CHANGE!
	// teachers need to be able to upload files to exclude and include
	// 
	
    $params = explode('/', $_SERVER['REQUEST_URI']);
	
	if ($params[2] === "upload") {
		// params[0] = ""
		// params[1] = "api.php"
		// params[2] = "upload"
		// params[3] = cid (course id)
		// params[4] = aid (assignment id)
		// params[5] = sid (student id)
		
		// build path 
	    $path = 'uploads/'.$params[3].'/'.$params[4].'/'.$params[5];

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
		$ifp = fopen($path."/".$params[5].'.zip', 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 

	    // call a python script to handle updating mysql
	    shell_exec('python post.py ' . $_SERVER['REQUEST_URI']);

	    // return to React
	    echo(true);
	} else if ($params[2] === "include") {
		// params[0] = ""
		// params[1] = "api.php"
		// params[2] = "exclude"
		// params[3] = cid (course id)
		// params[4] = aid (assignment id)
		// params[5] = file name
		
		// build path
		$path = 'uploads/'.$params[3].'/'.$params[4].'/include';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// how to handle old contents?

		// open/create a file for writing binary
		$ifp = fopen($path."/".$params[5], 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
		echo(false);
	} else if ($params[2] === "exclude") {
		// params[0] = ""
		// params[1] = "api.php"
		// params[2] = "exclude"
		// params[3] = cid (course id)
		// params[4] = aid (assignment id)
		// params[5] = file name
		
		// build path
		$path = 'uploads/'.$params[3].'/'.$params[4].'/exclude';

		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		// open/create a file for writing binary
		$ifp = fopen($path."/".$params[5], 'wb' ); 

	    // write bytes to file
	    fwrite( $ifp, base64_decode( $base64 ) );

	    // clean up the file resource
	    fclose( $ifp ); 
	    
		echo(true);
	} else if ($params[2] === "send") {
		$path = './uploads/zips/';
		// ensure directory structure exists
		if (!file_exists($path)) {
			mkdir($path, 0777, true);
		}

		shell_exec('python post.py ' . $_SERVER['REQUEST_URI']);
		echo(true);
	} else {
		echo(shell_exec('python post.py ' . $_SERVER['REQUEST_URI']));
	}    
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
	// params[0] = ""
	// params[1] = "api.php"
	// params[2] = "rminclude" or "rmexclude"
	// params[3] = cid (course id)
	// params[4] = aid (assignment id)
	$params = explode('/', $_SERVER['REQUEST_URI']);

	if ($params[2] === "rminclude") {
		$path = 'uploads/'.$params[3].'/'.$params[4].'/include';
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	} else if ($params[2] === "rmexclude") {
		$path = 'uploads/'.$params[3].'/'.$params[4].'/exclude';
		if (strpos($path, '.') !== false || strpos($path, '~') !== false) {
			// someone is trying something sneaky
			echo(false);
		} else if (file_exists($path)) {
			shell_exec("rm -R ".$path);
			echo(true);
		}
		echo(false);
	}
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
	$out = shell_exec('python put.py ' . $_SERVER['REQUEST_URI']);
    echo $out;
}
?>
