<?php

	error_log('yay');
	ini_set('display_errors', true);
	error_reporting(E_ALL);

	require("./AC_LOG.php");
	error_log('required');
	function trace($txt, $isArray=false){
		//return;
		$log = new LOG("ac_log.txt", true);
		//$log->clear();
		if($isArray){
			$log->printr($txt);
		}else{
			$log->write($txt);
		}
	}
	
	function startsWith($haystack, $needle){
		$length = strlen($needle);
		return (substr($haystack, 0, $length) === $needle);
	}
	
	function toJson($a){
		return '{"items":["' . (join('","', $a)) . '"]}';
	}
	
	$values = array('aaron', 'allan', 'allen', 'bill', 'bob', 'barb', 'chris', 'carl', 'dave', 'darrin', 'hank', 'henry');
	
	if(isset($_GET["value"])) {
		//$url = "https://gadi:demo@demo.observato.realisedatasystems.com" . urldecode($_GET["url"]);
		$value = urldecode($_GET["value"]);
		$value = rtrim($value, "*");
		$output = array();
		
		trace('$value ' . $value);
		
		for($i = 0; $i < count($values); ++$i) {
			trace('   ' .$values[$i]);
			if(startsWith($values[$i], $value)){
				trace('RETURN ' . $values[$i]);
				$output[] = $values[$i];
				
			}
		}
		
		echo toJson($output);
	}else{
		trace('url param not found');
	}


?>