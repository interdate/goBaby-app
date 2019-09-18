<?
	

	session_start();

	$get = &$_GET;
	$post = &$_GET;

	ini_set('DISPLAY_ERRORS',0);
	error_reporting(0);

	function getSocket(){
		$thisdate = strtotime(date("m/d/Y"));
		$appSocket = "shedate";

		return $appSocket.$thisdate;
	}
	$socket = getSocket();
	//echo $socket;

	// settings
	ini_set('date.timezone', 'America/New_York');
	ini_set('session.auto_start', 1);
	ini_set('display_errors', 0);
	ini_set('log_errors', 1);
	ini_set('error_log', dirname(__FILE__) . '/error_log.txt');
	error_reporting(E_NONE);

	// set coding
	header('Content-Type: text/html; charset=utf-8');
	
	
	// define's :
	define('CONFIG',true);
	define('M_PATH',dirname(__FILE__));
	define('M_URL','http://m.shedate.co.il/new/');
	define('S_URL','http://www.shedate.co.il/new/');
	define('P_URL',S_URL.'images/users/');

	// config db information;
	$dbconfig["dbname"] = "shedate_db";
	$dbconfig["host"] = "127.0.0.1";
	$dbconfig["port"] = "";
	$dbconfig["user"] = "mobile_dbuser";
	$dbconfig["password"] = "GkoS4Hxo";

	// paths
	$classpath = "class";
	$arraypath = "array";

	// login
	$login_salat = "fsdfsdf";

	// include_once all oop classes
	include_once($classpath."/db.class.php");
	include_once($classpath."/initialize.class.php");
	include_once($classpath."/user.class.php");
	include_once($classpath."/login.class.php");
	include_once($classpath."/search.class.php");
	include_once($classpath."/templates.class.php");
		

	// include all app array
	include_once($arraypath."/Permissions.php"); // $permissions
	include_once($arraypath."/LoggedPages.php"); // $loggedPages
	include_once($arraypath."/Redirects.php"); // $redirects
	include_once($arraypath."/Error.php"); // $error

	
	// check if we are on the api
	if(preg_match("/\/api\//",$_SERVER["REQUEST_URI"])){

		$_SESSION["userinfo"]["userEmail"] = urldecode($_REQUEST["username"]);
		$_SESSION["userinfo"]["userPass"] = urldecode($_REQUEST["password"]);

		
		//echo $socket;
		if (array_key_exists('api', $get)) {
			if($get["api"] != $socket){
				die("error");
			}
		}else{
			die("error");
		}
		
		
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');

		include_once($classpath."/api.class.php"); // $api class
		// load db
		$api = new api;
		define('API',1);
	}



	// load db
	$class_db = new MsSQL;

	// load app functions ( global )
	$class_app = new initialize;

	// load login / logout functions
	$class_login = new login;

	// load user class to get user info and generate user profiles
	$class_users = new users;

	// load search class
	$class_search = new search;

	// load template class
	$class_templates = new template;
	
	



	//check if user session is the users one / else logout any session
	if(!empty($_SESSION["userinfo"]["userEmail"]) && !empty($_SESSION["userinfo"]["userPass"]))
		$class_login->dologin($_SESSION["userinfo"]["userEmail"],$_SESSION["userinfo"]["userPass"]);
	else
		$class_login->dologin();


	// if user logged in - load privet msg class;
	if($_SESSION["logged"] == 1){
		// load msg class

		define('USERID',$_SESSION["userinfo"]["userId"]);
		define('USERPREMISSIONS',$_SESSION["permissions"]);
		define('USERLOCATION_LO',$_SESSION["userinfo"]["long"]);
		define('USERLOCATION_LA',$_SESSION["userinfo"]["lat"]);
		define('USEREMAIL',$_SESSION["userinfo"]["userEmail"]);
		define('USERNICK',$_SESSION["userinfo"]["userNick"]);
		include_once($classpath."/msg.class.php");
		$class_msg = new msg;

	}
	

?>