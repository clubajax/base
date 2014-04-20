<?php

	error_log('yay');
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	require("./LOG.php");
	error_log('required');
	function trace($txt, $isArray=false){
		//return;
		$log = new LOG("log_proxy.txt", true);
		//$log->clear();
		if($isArray){
			$log->printr($txt);
		}else{
			$log->write($txt);
		}
	}
	
	
	function getFileContents($url) {
		trace('curl...');

		// Initiate the curl session
		$ch = curl_init();
		$timeout = 5;

		// Point curl to the irl we want
		curl_setopt($ch, CURLOPT_URL, $url);

		// Set some cURL options
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_FRESH_CONNECT, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
		
		//CURLOPT_HTTPHEADER => array('Content-type: application/json') ,


		// Get the file contents

		trace('curl get...');
		//var_dump($ch);
		$file_contents = curl_exec($ch);

		trace("curl error: " . curl_error($ch));
		//print_r(curl_getinfo($ch));


		// Close the curl session
		trace('curl close...');
		curl_close($ch);

		trace('curl contents...');
		$content = implode('', array($file_contents));

		// Return the content
		return $content;

	}
	
	
	if(isset($_GET["url"])) {
		//$url = "https://gadi:demo@demo.observato.realisedatasystems.com" . urldecode($_GET["url"]);
		trace('unescaped url ' . $_GET["url"]);
		$url = urldecode($_GET["url"]);
		trace('get contents of ' . $url);
		$d = getFileContents($url);
		trace('got it:' . $d);
		
		echo $d;
	}else{
		trace('url param not found');
	}


?>