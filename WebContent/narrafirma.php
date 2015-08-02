<?php
/*
Plugin Name: NarraFirma
Description: Grounding your action on stories
Author: Cynthia F. Kurtz and Paul D. Fernhout
Version: 0.2
*/

// TODO: Ensure unique prefixed names for all functions or wrap in uniquely named objects

// Uses an option called "narrafirma" which is JSON text

defined( 'ABSPATH' ) or die( 'Plugin must be run from inside WordPress' );

$pointrelServerVersion = "pointrel20150417-0.0.4-wp";

class NarraFirmaSettingsPage
{
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    /**
     * Start up
     */
    public function __construct() {
        register_activation_hook(__FILE__, array( $this, 'activate')); 
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ));
        register_uninstall_hook( __FILE__, array( 'NarraFirmaSettingsPage', 'uninstall' ));
        
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }
    
    // Runs when plugin is activated
    function activate() {
        error_log("narrafirma plugin activate");
    }
    
    // Runs on plugin deactivation
    function deactivate() {
        error_log("narrafirma plugin deactivate");
    }
    
    function install() {
        global $wpdb;
        global $pointrelServerVersion;
        
        // Default the options if they are not already defined
        $options = array (
            'journals' => '{}',
            'db_version' => $pointrelServerVersion
        );
        add_option( 'narrafirma_admin_settings', $options );
    
        $table_name = $wpdb->prefix . 'narrafirma_pointrel20150417_messages';
        
        $charset_collate = $wpdb->get_charset_collate();

        // Make table fields for messages here...
        // sha256_length max 73 = 64 + 1 + 8 (8 = 16777215 max length)
        // Example timestamp length = 30: "2015-05-23T00:24:56.087000784Z"
        // TODO: Does not have journal name...
        $sql = "CREATE TABLE $table_name (
            id int unsigned NOT NULL AUTO_INCREMENT,
            sha256_and_length char(73) NOT NULL,
            received_timestamp char(30) NOT NULL, 
            topic_sha256 char(64) NOT NULL,
            topic_timestamp char(30) NOT NULL,
            message mediumtext NOT NULL,
            PRIMARY KEY id (id),
            UNIQUE KEY sha256_and_length (sha256_and_length),
            KEY received_timestamp (received_timestamp),
            KEY topic_by_timestamp (topic_sha256,topic_timestamp)
        ) $charset_collate;";
    
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    
        add_option( 'narrafirma_db_version', $pointrelServerVersion );
    }
    
    // Runs on plugin uninstall
    function uninstall() {
        error_log("narrafirma plugin uninstall");
        
        // Leave the option around for now during testing...
        // delete_option("narrafirma");
        
        // Perhaps should also remove narrafirma/pointrel database table (maybe after warning)
    }

    /**
     * Add options page
     */
    public function add_plugin_page() {
        // This page will be a top level menu item
        add_menu_page( 'NarraFirma Options', 'NarraFirma', 'manage_options', 'narrafirma-settings-admin', array( $this, 'create_admin_page' ));
    }

    /**
     * Options page callback
     */
    public function create_admin_page() {
        // Set class property
        $this->options = get_option( 'narrafirma_admin_settings' );
        
        $baseDirectory = plugins_url( 'narrafirma' );
    
        $launchLink = $baseDirectory . "/index.html";
    
        ?>
<div class="wrap">
<h2>NarraFirma plugin</h2>
Options relating to the NarraFirma Plugin.
<br>
The NarraFirma WordPress plugin uses WordPress as an application server, user authentication system, and data store.<br>
Using the WordPress platform this way makes NarraFirma easy to install and configure for many people.<br>
The NarraFirma application is not otherwise integrated with WordPress pages and runs in its own web page.<br>
<br>
Click this link to <a href="<?php echo $launchLink; ?>">launch the NarraFirma application</a>.
</div>

You can create projects by editing the NarraFirma configuration data here in JSON format:<br>
       
<form method="post" action="options.php">
<?php
    // This prints out all hidden setting fields
    settings_fields( 'narrafirma_option_group' );   
    do_settings_sections( 'narrafirma-settings-admin' );
    submit_button();
?>
</form>
</div>
<?php
    }

    public function page_init() {        
        register_setting('narrafirma_option_group', 'narrafirma_admin_settings', array( $this, 'sanitize' ) );

        add_settings_section(
            'narrafirma_setting_section_id',
            'My Custom Settings',
            array( $this, 'print_section_info' ),
            'narrafirma-settings-admin'
        ); 

        add_settings_field(
            'journals', 
            'Journals', 
            array( $this, 'display_journals' ), 
            'narrafirma-settings-admin', 
            'narrafirma_setting_section_id'
        );      
    }

    public function sanitize( $input ) {
        $new_input = array();
        
        if( isset( $input['journals'] ) ) {
            // Keep the raw input which is JSON with newlines...
            // $new_input['journals'] = sanitize_text_field( $input['journals'] );
            $new_input['journals'] = $input['journals'];
        }

        return $new_input;
    }

    public function print_section_info() {
        print 'Enter your settings below:';
    }

    public function display_journals() {
            printf(
            '<textarea cols="40" rows="5" name="narrafirma_admin_settings[journals]" style="white-space: pre-wrap;">%s</textarea>',
            isset( $this->options['journals'] ) ? esc_textarea( $this->options['journals']) : ''
        );
    }
}

if ( is_admin() ) {
    $narrafirma_settings_page = new NarraFirmaSettingsPage();
}

// TODO: Move these functions into a class...

add_action( 'wp_ajax_pointrel20150417', 'pointrel20150417' );
// add_action( 'wp_ajax_nopriv_pointrel20150417', 'pointrel20150417' );

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
    
    // TODO: Check permissions
    
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

function isUserAuthorized($userID, $permissions) {
    // error_log("isUserAuthorized " . $userID . " " . print_r($permissions, true));
    foreach($permissions as $nameOrRole) {
        if ($nameOrRole === true) return true;
        if ($nameOrRole == $userID) return true;
        if (current_user_can($nameOrRole)) return true;
    }
    return false;
}

function pointrel20150417_currentUserInformation($request) {
	$currentUser = wp_get_current_user();
	$userID = $currentUser->user_login;
	
	error_log("Called pointrel20150417_currentUserInformation " . $userID . " " . current_user_can( 'manage_options' ));
    
	// if ($userID == 0) $userID = "anonymous";
	
	$journalPermissions = array();
	
	// TODO: Handle errors if missing...
	$options = get_option( 'narrafirma_admin_settings' );
	$journals = json_decode( $options['journals'] );
	
	foreach($journals as $name => $permissions) {
        $admin = current_user_can( 'manage_options' );
        $write = $admin || isUserAuthorized($userID, $permissions->write);
	    $read = $write || isUserAuthorized($userID, $permissions->read);
	    if ($read) {
	        $journalPermissions[$name] = array("read" => $read, "write" => $write, "admin" => $admin);
	    }
	}
	
    // TODO: Fix hardcoded project
    $response = makeSuccessResponse(200, "Success", array(
		'status' => 'OK',
		'userIdentifier' => $userID,
		'journalPermissions' => $journalPermissions
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

    $userID = wp_get_current_user()->user_login;
    
    global $pointrelServerVersion;
    
    // global $wpdb; // this is how you get access to the database
    
    $journalIdentifier = $request->journalIdentifier;
    
    // TODO: Handle errors if missing...
    $options = get_option( 'narrafirma_admin_settings' );
    $journals = json_decode( $options['journals'] );
    
    $readAuthorization = false;
    $writeAuthorization = false;
    $adminAuthorization = false;
    
    if (isset($journals->$journalIdentifier)) {
        $permissions = $journals->$journalIdentifier;
        $admin = current_user_can( 'manage_options' );
        $write = $admin || isUserAuthorized($userID, $permissions->write);
        $read = $write || isUserAuthorized($userID, $permissions->read);
    }
    
    $response = makeSuccessResponse(200, "Success", array(
        'journalIdentifier' => $journalIdentifier,
        'version' => $pointrelServerVersion,
        'permissions' => array(
            // TODO: What about partial authorization for only some messages?
            'read' => $read,
            'write' => $write,
            'admin' => $admin
        )
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
    
    // wp_send_json( makeFailureResponse(500, "Server error: write not yet supported") );
    
    $receivedTimestamp = "FIXME???";
    $sha256AndLength = "FIXME";
    
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'Wrote content',
        'sha256AndLength' => $sha256AndLength,
        'receivedTimestamp' => $receivedTimestamp
    ));
    
    wp_send_json( $response );
}

error_log("Finished running NarraFirma plugin module");