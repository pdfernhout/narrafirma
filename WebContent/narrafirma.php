<?php
/*
Plugin Name: NarraFirma
Description: Grounding your action on stories
Author: Cynthia F. Kurtz and Paul D. Fernhout
Version: 0.2
*/

// TODO: Ensure unique prefixed names for all functions or wrap in uniquely named objects

defined( 'ABSPATH' ) or die( 'Plugin must be run from inside WordPress' );

$pointrelServerVersion = "pointrel20150417-0.0.4-wp";

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
    
    if ($requestType == "pointrel20150417_createJournal") {
        pointrel20150417_createJournal($request);
    }
    
    if ($requestType == "pointrel20150417_reportJournalStatus") {
        pointrel20150417_reportJournalStatus($request);
    }
    
    if ($requestType == "pointrel20150417_queryForNextMessage") {
        pointrel20150417_queryForNextMessage($request);
    }
    
    if ($requestType == "pointrel20150417_storeMessage") {
        pointrel20150417_storeMessage($request);
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

    // TODO: Fix hardcoded project
    $response = makeSuccessResponse(200, "Success", array(
		'status' => 'OK',
		'userIdentifier' => $currentUser->user_login,
		'journalPermissions' => array('NarraFirmaProject-test1' => array("read" => true))
	));
	
	wp_send_json( $response );
}

function pointrel20150417_createJournal($request) {
    error_log("Called pointrel20150417_createJournal");
    
	// global $wpdb; // this is how you get access to the database
	// $whatever = intval( $_POST['whatever'] );
	
	if (!current_user_can( 'manage_options' )) {
	    wp_send_json( makeFailureResponse(403, "Forbidden -- User is not an admin") );
	}
	
	$journalIdentifier = $request->journalIdentifier;
	
    // TODO: Actually do something here!!!
    
    $response = makeSuccessResponse(200, "Success", array(
		'journalIdentifier' => $journalIdentifier
	));
	
	wp_send_json( $response );
}

function pointrel20150417_reportJournalStatus($request) {
    error_log("Called pointrel20150417_reportJournalStatus");
    
    // global $wpdb; // this is how you get access to the database
    // $whatever = intval( $_POST['whatever'] );
    
    if (!current_user_can( 'manage_options' )) {
        wp_send_json( makeFailureResponse(403, "Forbidden -- User is not an admin") );
    }
    
    $journalIdentifier = $request->journalIdentifier;
    
    // TODO: Actually do something here!!!
    $readAuthorization = true;
    $writeAuthorization = true;
    $adminAuthorization = true;
            
    $response = makeSuccessResponse(200, "Success", array(
        'journalIdentifier' => $journalIdentifier,
        'version' => $pointrelServerVersion,
        'permissions' => array(
            // TODO: What about partial authorization for only some messages?
            'read' => $readAuthorization,
            'write' => $writeAuthorization,
            'admin' => $adminAuthorization
        ),
    ));
    
    if ($readAuthorization) {
        $earliestRecord = null;
        $latestRecord = null;
        $recordCount = 0; // $sortedReceivedRecords.length
        
        $response->journalEarliestRecord = $earliestRecord;
        $response->journalLatestRecord = $latestRecord;
        $response->journalRecordCount = $recordCount;
    }
    
    if ($writeAuthorization) {
        // Not sure what I really mean by this flag; sort of that the journal is currently in readOnly mode on the server end?
        $response->readOnly = false;
    }
    
    wp_send_json( $response );
}

function pointrel20150417_queryForNextMessage($request) {
    error_log("Called pointrel20150417_queryForNextMessage");
    
    // global $wpdb; // this is how you get access to the database
    // $whatever = intval( $_POST['whatever'] );
    
    // TODO: Actually do something here!!!
    
    $lastReceivedTimestampConsidered = null;
    $now = getCurrentUniqueTimestamp();
    $receivedRecordsForClient = array();
    
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'revisions',
        'currentTimestamp' => $now,
        'lastReceivedTimestampConsidered' => $lastReceivedTimestampConsidered,
        'receivedRecords' => $receivedRecordsForClient
    ));
    
    wp_send_json( $response );
}

function pointrel20150417_storeMessage($request) {
    error_log("Called pointrel20150417_storeMessage");
    
    // global $wpdb; // this is how you get access to the database
    // $whatever = intval( $_POST['whatever'] );
    
    // TODO: Actually do something here!!!
    
    wp_send_json( makeFailureResponse(500, "Server error: write not yet supported") );
    
    /*
    $receivedTimestamp = "FIXME???";
    $sha256AndLength = "FIXME";
    
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'Wrote content',
        'sha256AndLength' => $sha256AndLength,
        'receivedTimestamp' => $receivedTimestamp
    ));
    
    wp_send_json( $response );
    */
}

// Runs when plugin is activated
function narrafirma_plugin_install() {
    error_log("narrafirma_plugin_install");
}

// Runs on plugin deactivation
function narrafirma_plugin_remove() {
    error_log("narrafirma_plugin_remove");
}

function narrafirma_create_options_panel() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
  
    $baseDirectory = plugins_url( 'narrafirma' );
    
    ?>
<div>
<h2>NarraFirma plugin</h2>
Options relating to the NarraFirma Plugin.
</div>

<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;">
</canvas> 
<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,150,75);
</script>

<?php
}

function narrafirma_admin_add_page() {
    add_menu_page( 'NarraFirma Options', 'NarraFirma', 'manage_options', 'narrafirma-options-menu', 'narrafirma_create_options_panel' );
}

add_action( 'admin_menu', 'narrafirma_admin_add_page' );

register_activation_hook(__FILE__,'narrafirma_plugin_install'); 
register_deactivation_hook( __FILE__, 'narrafirma_plugin_remove' );

add_action( 'wp_ajax_pointrel20150417', 'pointrel20150417' );
// add_action( 'wp_ajax_nopriv_pointrel20150417', 'pointrel20150417' );

error_log("Finished running NarraFirma plugin module");