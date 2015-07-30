<?php
/*
Plugin Name: NarraFirma
Description: Grounding your action on stories
Author: Cynthia F. Kurtz and Paul D. Fernhout
Version: 0.2
*/

function add_my_plugin_menu() {
	add_options_page( 'NarraFirma Options', 'NarraFirma', 'manage_options', 'narrafirma-options-menu', 'create_my_plugin_options_panel' );
}

function create_my_plugin_options_panel() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
  $baseDirectory = plugins_url( 'narrafirma' );
  
  add_my_scripts();
    
  echo <<<ENDSCRIPT
<link rel="stylesheet" href="$baseDirectory/lib/humane/original.css">
<link rel="stylesheet" href="$baseDirectory/css/survey.css">
<link rel="stylesheet" href="$baseDirectory/css/standard.css">

<script>
var require = {
    baseUrl: '$baseDirectory',
    paths: {
        js: "js",
        applicationPanelSpecifications: "applicationPanelSpecifications",
        mithril: "lib/mithril/mithril",
        d3: "lib/d3/d3",
        humane: "lib/humane/humane",
        lib: "lib"
    }
};
</script>

<script type='text/javascript' src="$baseDirectory/lib/lodash.js"></script>
<script type='text/javascript' src="$baseDirectory/lib/fileSaver/Blob.js"></script>
<script type='text/javascript' src="$baseDirectory/lib/fileSaver/FileSaver.js"></script>
<script src="$baseDirectory/lib/require.min.js"></script>

<noscript>Please enable JavaScript to use NarraFirma. NarraFirma is companion software to the book Working With Stories in Your Community or Organization.</noscript>
<div id="pleaseWaitDiv" class="pleaseWaitOverlay" style="display: none">Starting up NarraFirma; please wait...</div>
<script>console.log("started loading..."); document.getElementById("pleaseWaitDiv").style.display="block";</script>

<div id="navigationDiv" style="display: none"></div>
<div id="pageDiv" style="overflow: auto; display: none;"></div>
<div id="toasterDiv"></div>
<div id="dialogDiv"></div>
<script>
// Load text with plugins here because TypeScript IDE does not like it elsehwere
require([
    "js/main",
    "lib/text!applicationPanelSpecifications/navigation.json",
    "lib/text!recommendations/recommendations_filledin.csv",
    "lib/text!recommendations/recommendations_intervention_filledin.csv"
], function(
    main,
    navigationJSONText,
    recommendationsText,
    recommendationsInterventionText
) {
    // Load these here because TypeScript does not like the plugin use
    window["narraFirma_navigationJSONText"] = navigationJSONText;
    window["narraFirma_recommendationsText"] = recommendationsText;
    window["narraFirma_recommendationsInterventionText"] = recommendationsInterventionText;
    
    console.log("Launching main application");
    main.run();
});
</script>

ENDSCRIPT;
}

function add_my_scripts() {
  // wp_enqueue_script( 'pointrel-lodash', plugins_url( 'narrafirma/lib/lodash.js'), array(), '1.0.0', true );
  // wp_enqueue_script( 'pointrel-main', plugins_url( 'narrafirma/js/main.js'), array(), '1.0.0', true );
}

function getCurrentUniqueTimestamp() {
    return "FIXME_TIMESTAMP";
}

function makeFailureResponse($statusCode, $description, $extra = false) {
   $response = array(
        'success' => false, 
        'statusCode' => $statusCode,
        'description' => $description,
        'timestamp' => getCurrentUniqueTimestamp()
    );
    
    if (is_array($extra)) {
        $response = array_merge($response, $extra);
    }
    
    return $response;
}

function makeSuccessResponse($statusCode, $description, $extra = false) {
   $response = array(
        'success' => true, 
        'statusCode' => $statusCode,
        'description' => $description,
        'timestamp' => getCurrentUniqueTimestamp()
    );
    
    if (is_array($extra)) {
        $response = array_merge($response, $extra);
    }
    
    return $response;
}

function pointrel20150417() {
    error_log("Called pointrel20150417 ajax");
    
    $request = json_decode( file_get_contents( 'php://input' ) );
    
    $requestType = $request->action;
    
    if ($requestType == "pointrel20150417_currentUserInformation") {
        pointrel20150417_currentUserInformation($request);
    }
    
    $response = makeFailureResponse(501, "Not Implemented: requestType not supported", array("requestType" => $requestType));
    
    wp_send_json( $response );
}

function pointrel20150417_currentUserInformation($request) {
    error_log("Called pointrel20150417_currentUserInformation");
    
	// global $wpdb; // this is how you get access to the database
	// $whatever = intval( $_POST['whatever'] );
	
	$currentUser = wp_get_current_user();
	
	// if ($userID == 0) $userID = "anonymous";

    $response = makeSuccessResponse(200, "Success", array(
		'status' => 'OK',
		'userIdentifier' => $currentUser->user_login
	));
	
	wp_send_json( $response );
}

add_action( 'wp_ajax_pointrel20150417', 'pointrel20150417' );
add_action( 'wp_ajax_nopriv_pointrel20150417', 'pointrel20150417' );

// add_action( 'wp_enqueue_scripts', 'add_my_scripts' );
add_action( 'admin_menu', 'add_my_plugin_menu' );

error_log("Done adding NarraFirma plugin");