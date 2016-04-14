<?php
/*
Plugin Name: NarraFirma
Plugin URI: http://narrafirma.com
Description: Participatory Narrative Inquiry in a box. Gather stories and make sense of challenges and opportunities in your community or organization.
Author: Cynthia F. Kurtz and Paul D. Fernhout
Version: 0.9.8
Author URI: http://cfkurtz.com
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

namespace NarraFirma;

defined( 'ABSPATH' ) or die( 'Plugin must be run from inside WordPress' );

$NARRAFIRMA_VERSION = '0.9.8';

$pointrelServerVersion = "pointrel20150417-0.0.4-wp";

// Uses an option called "narrafirma" which is JSON text

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
        // register_uninstall_hook( __FILE__, array( 'NarraFirma\\NarraFirmaSettingsPage', 'uninstall' ));
        
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }
    
    // Runs when plugin is activated
    function activate() {
        // error_log("narrafirma plugin activate");
    }
    
    // Runs on plugin deactivation
    function deactivate() {
        // error_log("narrafirma plugin deactivate");
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
    }
    
    // Runs on plugin uninstall
    function uninstall() {
        // error_log("narrafirma plugin uninstall");
        
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
        global $NARRAFIRMA_VERSION;
    
        // Set class property
        $this->options = get_option( 'narrafirma_admin_settings' );
        
        $baseDirectory = plugins_url( 'narrafirma' );
    
        $launchLink = $baseDirectory . "/webapp/narrafirma.html";
    
        ?>
<div class="wrap">

    <h2><?php echo "NarraFirma $NARRAFIRMA_VERSION"; ?></h2>
    <p>The NarraFirma&trade; web application supports Participatory Narrative Inquiry (PNI). 
    PNI is a method in which ordinary people share ordinary stories in a way that helps them 
    discover insights they can use. To learn more about PNI, visit <a href="http://www.narrafirma.com" target="_blank">narrafirma.com</a>
    and <a href="http://www.workingwithstories.org" target="_blank">workingwithstories.org</a>.
    </p>
    <p>
    <i>The NarraFirma plugin uses WordPress as an application server, 
    user authentication system, and data store. Using WordPress in this way makes the NarraFirma software easier to install and 
    configure. The NarraFirma application is not otherwise integrated with WordPress pages 
    and runs in its own web page.</i>
    </p>
    <h2><a href="<?php echo $launchLink; ?>" target="_blank">Click here to launch the NarraFirma application</a></h2>
    
    <div id="narrafirma-project-list-editor">
    </div>
    
    <div id="narrafirma-json-form">
        <form method="post" action="options.php">
        <?php
            // This prints out all hidden setting fields
            settings_fields( 'narrafirma_option_group' );   
            do_settings_sections( 'narrafirma-settings-admin' );
            submit_button();
        ?>
        </form>
        
        <div id="narrafirma-example">
            You can create projects by editing the NarraFirma configuration data here in JSON format.<br>
            <br>
            An example:
            <pre>
            {
                "NarraFirmaProject-test1": {
                     "write": ["editor", "pdfernhout", "cfkurtz"],
                     "read": ["subscriber"],
                     "survey": [true]
                }
            }
            </pre>
        </div>
    </div>

</div>
<?php
    }

    public function page_init() {        
        register_setting('narrafirma_option_group', 'narrafirma_admin_settings', array( $this, 'sanitize' ) );

        add_settings_section(
            'narrafirma_setting_section_id',
            'NarraFirma Settings',
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
        // error_log("Called NarraFirma sanitize");
    
        $new_input = array();
        
        if( isset( $input['journals'] ) ) {
            // Keep the raw input which is JSON with newlines...
            // $new_input['journals'] = sanitize_text_field( $input['journals'] );
            $new_input['journals'] = $input['journals'];
        }
        
        $this->ensureAllJournalsExist($new_input['journals']);

        return $new_input;
    }
    
    public function ensureAllJournalsExist($journalsJSON) {
        $journals = json_decode( $journalsJSON );
        
        foreach($journals as $name => $permissions) {
            if (!doesJournalTableExist($name)) {
                // error_log("ensureAllJournalsExists about to create table for: " . $name);
                makeJournalTable($name);
            }
        }
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

function narrafirma_admin_enqueue_scripts($hook) {
    // error_log("narrafirma_admin_enqueue_scripts $hook");
    
    // TODO: Maybe this name should be assigned to a global on page creation?
    if ($hook != "toplevel_page_narrafirma-settings-admin") return;
        
    wp_enqueue_script( 'mithril', plugin_dir_url( __FILE__ ) . 'webapp/lib/mithril/mithril.js' );
    wp_enqueue_script( 'narrafirma-admin-js', plugin_dir_url( __FILE__ ) . 'narrafirmaWordPressAdmin.js' );
}
add_action( 'admin_enqueue_scripts', 'NarraFirma\\narrafirma_admin_enqueue_scripts' );

add_action( 'wp_ajax_pointrel20150417', 'NarraFirma\\pointrel20150417' );
add_action( 'wp_ajax_nopriv_pointrel20150417', 'NarraFirma\\pointrel20150417' );

function getCurrentUniqueTimestamp() {
    // TODO: Probably need extra digits and to assure unique...
    // return gmdate('Y-m-d\TH:i:s.u\Z');
    // $now = DateTime::createFromFormat('U.u', microtime(true));
    // return $now->format('Y-m-d\TH:i:s.u\Z');
    
    // TODO: Is the random add on really needed; could microtime give more digits of precision?
    // TODO: No longer enforcing incremental time in final digits four through six to avoid collisions unlike with NodejS -- is this OK enough?
    $randomDigits = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);

    $t = microtime(true);
    $extra = sprintf("%06d", ($t - floor($t)) * 1000000);
    $extra = $extra.$randomDigits;
    $utc = gmdate('Y-m-d\TH:i:s.', $t).$extra.'Z';
    return $utc;    
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

// TODO: How to find list of tables to upgrade in future? Perhaps: SHOW TABLES LIKE 'someprefix\_%'

function tableNameForJournal($journalName) {
    global $wpdb;
    
    $sanitizedJournalName = preg_replace('/[^a-zA-Z0-9_]+/', '_', $journalName);
    
    $table_name = $wpdb->prefix . 'narrafirma_j_' . $sanitizedJournalName;
    
    $table_name = strtolower($table_name);
    
    // Enforce MySQL limit on table name length
    if (strlen($table_name) > 64) {
        throw new Exception('NarraFirma user table name length for journal longer than 64 characters: ' . $table_name);
    }
    
    return $table_name;
}

function doesJournalTableExist($journalName) {
    global $wpdb;

    $table_name = tableNameForJournal($journalName);
    return ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name);
}

function makeJournalTable($journalName) {
    global $wpdb;
    
    $table_name = tableNameForJournal($journalName);
    
    $charset_collate = $wpdb->get_charset_collate();

    // Make table fields for messages here...
    // sha256_length max 73 = 64 + 1 + 8 (8 = 16777215 max length)
    // Example timestamp length = 30: "2015-05-23T00:24:56.087000784Z"
    $sql = "CREATE TABLE $table_name (
        id int(9) UNSIGNED NOT NULL AUTO_INCREMENT,
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
}

function isUserAuthorized($userID, $permissions) {
    // error_log("isUserAuthorized '" . $userID . "' " . print_r($permissions, true));
    foreach($permissions as $nameOrRole) {
        // error_log("isUserAuthorized loop '$userID' '$nameOrRole'");
        if ($nameOrRole === true) return true;
        if ($nameOrRole == $userID) return true;
        if (current_user_can($nameOrRole)) return true;
    }
    return false;
}

// Check permissions for user on journal and topic
// Unlike NodeJS version, does not currently support fine-grained permissions on topic except for survey
function faiIfNotAuthorized($requestedCapability, $journalIdentifier, $topicIdentifier) {    
    $userIdentifier = wp_get_current_user()->user_login;
    
    // error_log("faiIfNotAuthorized '$userIdentifier' $requestedCapability $journalIdentifier '$topicIdentifier'");
    
    // TODO: Handle errors if missing...
    $options = get_option( 'narrafirma_admin_settings' );
    $journals = json_decode( $options['journals'] );
    
    if (!isset($journals->$journalIdentifier)) {
        wp_send_json( makeFailureResponse(404, "No such journal", array( 'journalIdentifier' => $journalIdentifier ) ) );
    }
    
    if (!doesJournalTableExist($journalIdentifier)) {
        wp_send_json( makeFailureResponse(404, "No such journal table", array( 'journalIdentifier' => $journalIdentifier ) ) );
    }
    
    $permissions = $journals->$journalIdentifier;
    $admin = current_user_can( 'manage_options' );
    
    if ($requestedCapability == "admin" && $admin) return;
    
    // Need to check if can write always as might be needed for checking if can read
    $write = $admin || isUserAuthorized($userIdentifier, $permissions->write);
    
    if ($requestedCapability == "write") {
        if ($write) return;
        
        // Check if survey access
        if ($topicIdentifier == "surveyResults" && isUserAuthorized($userIdentifier, $permissions->survey)) return;
    }
      
    if ($requestedCapability == "read") {
        $read = $write || isUserAuthorized($userIdentifier, $permissions->read);
        if ($read) return;
        
        // Check if survey access
        if ($topicIdentifier == "questionnaires" && isUserAuthorized($userIdentifier, $permissions->survey)) return;
    }
    
    error_log("faiIfNotAuthorized fail: '" . $userIdentifier . "' " . print_r($permissions, true));
    
    $message = 'Forbidden -- user "' . $userIdentifier . '" is not authorized to "' . $requestedCapability . '" in ' . my_json_encode($journalIdentifier) . " (perhaps for the specific topic, message, and/or api request length)";
    wp_send_json( makeFailureResponse(403, $message, array(
        'userIdentifier' => $userIdentifier,
        'journalIdentifier' => $journalIdentifier,
        'requestedCapability' => $requestedCapability
    ) ) );
}

function makeRecordForClient($row, $includeMessageContents) {
    $recordForClient = array(
        "receivedTimestamp" => $row->received_timestamp,
        "sha256AndLength" => $row->sha256_and_length,
        "topicSHA256" => $row->topic_sha256,
        "topicTimestamp" => $row->topic_timestamp
        // _debugLoadingSequence: receivedRecord.loadingSequence
    );
    
    if ($includeMessageContents) {
        // TODO: Error handling if json_decode fails
        // TODO: Add to message trace
        $recordForClient["messageContents"] = json_decode($row->message);
    };
    
    return $recordForClient;
}

function pointrel20150417() {
    try {
        pointrel20150417_dispatch();
    } catch (Exception $e) {
        wp_send_json( makeFailureResponse(500, "Server error: caught exception: " . $e->getMessage() ) );
    }
}

function pointrel20150417_dispatch() {
    // error_log("Called pointrel20150417 ajax by '" . wp_get_current_user()->user_login ."'");
    
    $apiRequest = json_decode( file_get_contents( 'php://input' ) );
    
    $requestType = $apiRequest->action;
    
    if ($requestType == "pointrel20150417_currentUserInformation") {
        pointrel20150417_currentUserInformation($apiRequest);
    }
    
    if ($requestType == "pointrel20150417_createJournal") {
        pointrel20150417_createJournal($apiRequest);
    }
    
    if ($requestType == "pointrel20150417_reportJournalStatus") {
        pointrel20150417_reportJournalStatus($apiRequest);
    }
    
    if ($requestType == "pointrel20150417_queryForNextMessage") {
        pointrel20150417_queryForNextMessage($apiRequest);
    }
    
    if ($requestType == "pointrel20150417_storeMessage") {
        pointrel20150417_storeMessage($apiRequest);
    }
    
    if ($requestType == "pointrel20150417_queryForLatestMessage") {
        pointrel20150417_queryForLatestMessage($apiRequest);
    }
    
    error_log("pointrel20150417 ajax not implemented: $requestType");
    $response = makeFailureResponse(501, "Not Implemented: requestType not supported", array("requestType" => $requestType));
    
    wp_send_json( $response );
}

function pointrel20150417_currentUserInformation($apiRequest) {
	$currentUser = wp_get_current_user();
	$userID = $currentUser->user_login;
	
	// error_log("Called pointrel20150417_currentUserInformation " . $userID . " " . current_user_can( 'manage_options' ));
    
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
	
    $response = makeSuccessResponse(200, "Success", array(
		'status' => 'OK',
		'userIdentifier' => $userID,
		'journalPermissions' => $journalPermissions
	));
	
	wp_send_json( $response );
}

function pointrel20150417_createJournal($apiRequest) {
    // error_log("Called pointrel20150417_createJournal");
    
	if (!current_user_can( 'manage_options' )) {
	    wp_send_json( makeFailureResponse(403, "Forbidden -- User is not an admin") );
	}
	
	$journalIdentifier = $apiRequest->journalIdentifier;
	
    // TODO: Actually do something here!!!
    
    wp_send_json( makeFailureResponse(500, "Creating journal not supported yet") );
    
    /*
    $response = makeSuccessResponse(200, "Success", array(
		'journalIdentifier' => $journalIdentifier
	));
	
	wp_send_json( $response );
	*/
}

function pointrel20150417_reportJournalStatus($apiRequest) {
    global $pointrelServerVersion;
    global $wpdb;
    
    // error_log("Called pointrel20150417_reportJournalStatus");

    $userID = wp_get_current_user()->user_login;
        
    $journalIdentifier = $apiRequest->journalIdentifier;
    
    // TODO: Handle errors if missing...
    $options = get_option( 'narrafirma_admin_settings' );
    $journals = json_decode( $options['journals'] );
    
    if (!isset($journals->$journalIdentifier)) {
        wp_send_json( makeFailureResponse(404, "No such journal", array( 'journalIdentifier' => $journalIdentifier ) ) );
    }
    
    if (!doesJournalTableExist($journalIdentifier)) {
        wp_send_json( makeFailureResponse(404, "No such journal table", array( 'journalIdentifier' => $journalIdentifier ) ) );
    }
    
    $permissions = $journals->$journalIdentifier;
    $admin = current_user_can( 'manage_options' );
    $write = $admin || isUserAuthorized($userID, $permissions->write);
    $read = $write || isUserAuthorized($userID, $permissions->read);
    $survey = $write || isUserAuthorized($userID, $permissions->survey);

    // No support for authorization only for specific topics, other than survey
    
    $response = makeSuccessResponse(200, "Success", array(
        'journalIdentifier' => $journalIdentifier,
        'version' => $pointrelServerVersion,
        'permissions' => array(
            'admin' => $admin,
            'write' => $write,
            'read' => $read,
            // Added survey which NodeJS version does not have
            'survey' => $survey
        )
    ));
    
    // TODO: Is this entire clause really needed?
    if ($read) {
        $earliestRecord = null;
        $latestRecord = null;
        $recordCount = 0; // $sortedReceivedRecords.length
        
        if (doesJournalTableExist($journalIdentifier)) {
            $table_name = tableNameForJournal($journalIdentifier);
            
            // TODO: Is the journalRecordCount really needed? Looks like maybe not?
            $rows = $wpdb->get_results( "SELECT COUNT(*) AS num_records FROM $table_name" );
            // error_log("$rows" . my_json_encode($rows));
            $recordCount = $rows[0]->num_records; // $wpdb->num_rows;
            
            // TODO: use database to get earliest and latest record
            // TODO: Is the earliest record really needed?  Looks like maybe not?
            // TODO: Is the latest record really needed? Looks like maybe not?
        }
        
        $response["journalEarliestRecord"] = $earliestRecord;
        $response["journalLatestRecord"] = $latestRecord;
        $response["journalRecordCount"] = $recordCount;
    }
    
    if ($write) {
        // Not sure what I really mean by this flag; sort of that the journal is currently in readOnly mode on the server end?
        $response["readOnly"] = false;
    }
    
    wp_send_json( $response );
}

function pointrel20150417_queryForNextMessage($apiRequest) {
    global $wpdb;

    // error_log("Called pointrel20150417_queryForNextMessage");
    
    $now = getCurrentUniqueTimestamp();
    
    $journalIdentifier = $apiRequest->journalIdentifier;
      
    // Check if topicIdentifier is not defined to avoid PHP warning
    if (isset($apiRequest->topicIdentifier)) {
        $topicIdentifier = $apiRequest->topicIdentifier;
    } else {
        $topicIdentifier = null;
    }
    
    faiIfNotAuthorized("read", $journalIdentifier, $topicIdentifier);
    
    // wp_send_json( makeFailureResponse(500, "Server error: write not yet supported") );
    
    $table_name = tableNameForJournal($journalIdentifier);
    
    $fromTimestampExclusive = $apiRequest->fromTimestampExclusive;
    if (! $fromTimestampExclusive) {
        $fromTimestampExclusive = "0";
    }
    $fromTimestampExclusive = esc_sql($fromTimestampExclusive);
    
    $includeMessageContents = $apiRequest->includeMessageContents;
    
    // TODO: Use constant here for maximum
    $limitCount = max(1, min(100, intval($apiRequest->limitCount)));
    
    /*
        id int(9) UNSIGNED NOT NULL AUTO_INCREMENT,
        sha256_and_length char(73) NOT NULL,
        received_timestamp char(30) NOT NULL, 
        topic_sha256 char(64) NOT NULL,
        topic_timestamp char(30) NOT NULL,
        message mediumtext NOT NULL,
    */
    
    // messageContents
    
    /*
    var receivedRecordForClient = {
        receivedTimestamp: receivedRecord.receivedTimestamp,
        sha256AndLength: receivedRecord.sha256AndLength,
        topicSHA256: receivedRecord.topicSHA256,
        topicTimestamp: receivedRecord.topicTimestamp,
        _debugLoadingSequence: receivedRecord.loadingSequence
    };
    */
    
    $topicSHA256 = hash( 'sha256', $topicIdentifier );
    
    // TODO: Maybe just user record id instead of timestamp?
    // TODO: Maybe use prepared query (or two different versions) for speed?
    // Limiting the search to earlier "now" in case another PHP process adds a record while this is running
    $query = "SELECT * FROM $table_name WHERE received_timestamp > '$fromTimestampExclusive' AND received_timestamp < '$now'";
    if ($topicIdentifier) {
        $query = $query . " AND topic_sha256 = '$topicSHA256'";
    }
    
    $rows = $wpdb->get_results("$query LIMIT $limitCount", OBJECT);
    
    $receivedRecordsForClient = array();
    
    $lastReceivedTimestampConsidered = null;
    
    // error_log('rows: ' . print_r($rows, true));
    
    // TODO: Put records into result...
    foreach ( $rows as $row ) {
        $recordForClient = makeRecordForClient($row, $includeMessageContents);
        $receivedRecordsForClient[] = $recordForClient;
        $lastReceivedTimestampConsidered = $row->received_timestamp;
    }
    
    // TODO: Ignoring case of where exactly limitCount new records and so is up to date, leading to unneeded query later by client...
    if (count($rows) < $limitCount) {
        $lastReceivedTimestampConsidered = $now;
    }
    
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'revisions',
        'currentTimestamp' => $now,
        'lastReceivedTimestampConsidered' => $lastReceivedTimestampConsidered,
        'receivedRecords' => $receivedRecordsForClient
    ));
    
    wp_send_json( $response );
}

function pointrel20150417_queryForLatestMessage($apiRequest) {
    global $wpdb;

    // error_log("Called pointrel20150417_queryForLatestMessage");

    $now = getCurrentUniqueTimestamp();
    
    $journalIdentifier = $apiRequest->journalIdentifier;
      
    // Check if topicIdentifier is not defined to avoid PHP warning
    if (isset($apiRequest->topicIdentifier)) {
        $topicIdentifier = $apiRequest->topicIdentifier;
    } else {
        $topicIdentifier = null;
    }
    
    faiIfNotAuthorized("read", $journalIdentifier, $topicIdentifier);
    
    $table_name = tableNameForJournal($journalIdentifier);

    $topicSHA256 = hash( 'sha256', $topicIdentifier );
    
    // TODO: Maybe use prepared query for speed?
    // TODO: Maybe just user record id instead of timestamp?
    $query = "SELECT * FROM $table_name";
    if ($topicIdentifier) {
        $query = $query . " WHERE topic_sha256 = '$topicSHA256'";
    }

    $rows = $wpdb->get_results("$query ORDER BY received_timestamp DESC LIMIT 1", OBJECT);
    
    if (count($rows) == 0) {
        $latestRecord = null;
        // error_log("pointrel20150417_queryForLatestMessage: no match");
    } else {
        $includeMessageContents = true;
        $latestRecord = makeRecordForClient($rows[0], $includeMessageContents);
        // error_log("pointrel20150417_queryForLatestMessage: one match " . print_r($rows[0], true));
    }
    
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'latest',
        'currentTimestamp' => $now,
        'latestRecord' => $latestRecord
    ));
    
    wp_send_json( $response );   
}

function startsWith($haystack, $needle) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function isSHA256AndLengthIndexed($journal, $sha256AndLength) {
    // TODO: Check if message has already been stored so do not store it again
    return false;
}

function copyObjectWithSortedKeys($value) {
    if (is_array($value)) {
        return array_map("NarraFirma\\copyObjectWithSortedKeys", $value);
    } else if (is_object($value)) {
        $valueCopyWithSortedKeys = array();

        foreach ($value as $key => $value) {
            $valueCopyWithSortedKeys[$key] = copyObjectWithSortedKeys($value);
        }
        
        ksort($valueCopyWithSortedKeys);

        return  (object) $valueCopyWithSortedKeys;
    
    } else {
        return $value;
    }
}

function pointrel20150417_storeMessage($apiRequest) {
    global $wpdb;

    $message = $apiRequest->message;
    // error_log("Called pointrel20150417_storeMessage with: " . json_encode($message));
    
    $journalIdentifier = $apiRequest->journalIdentifier;
    
    // Check if topicIdentifier is not defined to avoid PHP warning
    if (isset($message->_topicIdentifier)) {
        $topicIdentifier = $message->_topicIdentifier;
    } else {
        $topicIdentifier = null;
    }
    
    faiIfNotAuthorized("write", $journalIdentifier, $topicIdentifier);
    
    $table_name = tableNameForJournal($journalIdentifier);
    $receivedTimestamp = getCurrentUniqueTimestamp();
    
    // Need to calculate SHA and length without trace and in canonical form as utf-8 encoded
    
    $oldSHA256AndLength = $message->__pointrel_sha256AndLength;
    $oldTrace = $message->__pointrel_trace;
    
    if ($oldTrace && !is_array($oldTrace)) {
        wp_send_json( makeFailureResponse(400, "Bad Request: trace field should be an array if it is defined" ) );
     }
    
    if (!$oldTrace) $oldTrace = array();
    
    // Calculate the sha256AndLength without the pointrel fields
    
    // Remove all "__pointrel_" tags from the top level, which includes sha256AndLength and trace and any other local metadata
    $cloneArray = $message;
    foreach( $cloneArray as $key => $value ) {
        if (startsWith($key, "__pointrel_")) { 
           unset($message->$key);
        }
    }

    $canonicalMessageWithoutHashAndTrace = copyObjectWithSortedKeys($message);
      
    // $canonicalFormInUTF8 = my_json_encode($canonicalMessageWithoutHashAndTrace, JSON_UNESCAPED_UNICODE);
    $canonicalFormInUTF8 = my_json_encode($canonicalMessageWithoutHashAndTrace);
    $sha256AndLength = hash( 'sha256', $canonicalFormInUTF8 ) . "_" . strlen($canonicalFormInUTF8);
   
    if ($oldSHA256AndLength && $oldSHA256AndLength !== $sha256AndLength) {
        error_log("Problem with new calculated SHA not matching old supplied one: $oldSHA256AndLength new: $sha256AndLength ");
        error_log("canonicalFormInUTF8 was: $canonicalFormInUTF8");
        wp_send_json( makeFailureResponse(400, "Bad Request: sha256AndLength was supplied in message but it does not match the calculated value; old: $oldSHA256AndLength new: $sha256AndLength" ) );
    }
    
    if (isSHA256AndLengthIndexed($journalIdentifier, $sha256AndLength)) {
        wp_send_json(makeFailureResponse(409, "Conflict: The message already exists on the server", array("sha256AndLength" => $sha256AndLength)));
    }
    
    $message->__pointrel_sha256AndLength = $sha256AndLength;
    
    // TODO: Determine server name
    $serverName = "UNFINISHED_SERVER_NAME";
        
    // Maybe could improve on this; see: http://stackoverflow.com/questions/3003145/how-to-get-the-client-ip-address-in-php
    $senderIPAddress = $_SERVER['REMOTE_ADDR'];
    
    $userIdentifier = wp_get_current_user()->user_login;
    
    $receivedTimestamp = getCurrentUniqueTimestamp();
    
    // Put in some local information
    // TODO: More thinking about the meaning of a trace???
    // TODO: Add more info about who stored this information
    // TODO: Maybe add other things, like requester IP or user identifier?
    $traceEntry = array(
        "receivedByJournalIdentifier" => $journalIdentifier,
        "receivedByServer" => $serverName,
        // TODO: How to best identify from where or from whom this is received from???
        "senderIPAddress" => $senderIPAddress,
        "userIdentifier" => $userIdentifier,
        "receivedTimestamp" => $receivedTimestamp
    );
    
    $oldTrace[] = $traceEntry;
    
    $message->__pointrel_trace = $oldTrace;
    
    $canonicalMessage = copyObjectWithSortedKeys($message);
    
    // $messageText = my_json_encode($canonicalMessage, JSON_UNESCAPED_UNICODE);
    $messageText = my_json_encode($canonicalMessage);
    
    // TODO: Check for empty topic and maybe act differently
    $topicSHA256 = hash( 'sha256', $topicIdentifier );
    $topicTimestamp = $message->_topicTimestamp;
    
    /*
        id int(9) UNSIGNED NOT NULL AUTO_INCREMENT,
        sha256_and_length char(73) NOT NULL,
        received_timestamp char(30) NOT NULL, 
        topic_sha256 char(64) NOT NULL,
        topic_timestamp char(30) NOT NULL,
        message mediumtext NOT NULL,
    */
    
        
    // TODO: Remove this
    // error_log("pointrel20150417_storeMessage: everything OK and ready to store -- but not storing for now as test");
    // throw new Exception("storing disabled for now while test canonical JSON SHA calculation");
    
    $wpdb->insert( 
        $table_name, 
        array( 
            'sha256_and_length' => $sha256AndLength, 
            'received_timestamp' => $receivedTimestamp,
            'topic_sha256' => $topicSHA256, 
            'topic_timestamp' => $topicTimestamp, 
            'message' => $messageText
        )
    );
    
    $insert_id = $wpdb->insert_id;
    
    // error_log("pointrel20150417_storeMessage inserted row " . $insert_id);
        
    $response = makeSuccessResponse(200, "Success", array(
        'detail' => 'Wrote content',
        'sha256AndLength' => $sha256AndLength,
        'receivedTimestamp' => $receivedTimestamp,
        // TODO: Adding extra id field for testing...
        'insert_id' => $insert_id
    ));
    
    wp_send_json( $response );
}

// This is to support PHP 5.3 which does not support JSON_UNESCAPED_UNICODE or JSON_UNESCAPED_SLASHES
// TODO: Ensure json_encode produces utf-8
function my_json_encode($data) {
   $result = json_encode($data);
   // To act like JSON_UNESCAPED_UNICODE
   $result = preg_replace_callback('/\\\\u([0-9a-f]{4})/i', function($matches) {
       return mb_convert_encoding(pack('H*', $matches[1]), 'UTF-8', 'UTF-16');
   }, $result);
   // To act like JSON_UNESCAPED_SLASHES
   $result = str_replace('\\/', '/', $result);
   return $result;
}

// error_log("Finished running NarraFirma plugin module");