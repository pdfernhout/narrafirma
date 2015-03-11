<?php
/*
Plugin Name: NarraFirma
Description: Grounding your action on stories
Author: Cynthia F. Kurtz and Paul D. Fernhout
Version: 0.1
*/

function create_my_plugin_options_panel() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
  $baseDirectory = plugins_url( 'narrafirma' );
  echo <<<ENDSCRIPT
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/resources/dojo.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dijit/themes/dijit.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dijit/themes/claro/claro.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojox/layout/resources/ResizeHandle.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojox/widget/Wizard/Wizard.css">
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojox/widget/Toaster/Toaster.css">

<link rel="stylesheet" href="$baseDirectory/lib/dgrid/css/dgrid.css">
<link rel="stylesheet" href="$baseDirectory/lib/dgrid/css/skins/claro.css">
<link rel="stylesheet" href="$baseDirectory/lib/dgrid/css/extensions/ColumnResizer.css">

<link rel="stylesheet" href="$baseDirectory/css/standard.css">

  <script type='text/javascript'>
    var dojoConfig;
    (function() {
        // Determine the containing location of this page by removing the actual page name (e.g. "test.html") at the end
        var baseDirectoryFromURL = "$baseDirectory";
        dojoConfig = {
            async: true,
            parseOnLoad: false,
            // cacheBust: "1.10.4",
            // Load dgrid and its dependencies from a local copy.
            // More complexity is required because these are not in the same directory as dojo modules when loaded locally or dojo base is loaded from CDN
            packages: [
                { name: "js", location: baseDirectoryFromURL + "/js"},
                { name: "lib", location: baseDirectoryFromURL + "/lib"},
                { name: "dgrid", location: baseDirectoryFromURL + "/lib/dgrid" },
                { name: "dstore", location: baseDirectoryFromURL + "/lib/dstore" },
                { name: "put-selector", location: baseDirectoryFromURL + "/lib/put-selector" },
                { name: "xstyle", location: baseDirectoryFromURL + "/lib/xstyle" }
            ]
        };
    }());
  </script>
  
  <div class="claro">
    <noscript>Please enable JavaScript to use NarraFirma. NarraFirma is companion software to the book Working With Stories in Your Community or Organization.</noscript>
    <div id="pleaseWaitDiv" style="display: none"><b>Starting up NarraFirma; please wait...</b></div>
    <script>console.log("started loading..."); document.getElementById("pleaseWaitDiv").style.display="block";</script>
        
    <div id="navigationDiv"></div>
    <div id="pageDiv" style="overflow: auto"></div>
  </div>
ENDSCRIPT;
  add_my_scripts();
}

function add_my_plugin_menu() {
	add_options_page( 'NarraFirma Options', 'NarraFirma', 'manage_options', 'narrafirma-options-menu', 'create_my_plugin_options_panel' );
}

function add_my_scripts() {
  wp_enqueue_script( 'pointrel-lodash', plugins_url( 'narrafirma/lib/lodash.js'), array(), '1.0.0', true );
  wp_enqueue_script( 'pointrel-dojo', '//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js', array(), '1.0.0', true );
  wp_enqueue_script( 'pointrel-main', plugins_url( 'narrafirma/js/main.js'), array(), '1.0.0', true );
}

// add_action( 'wp_enqueue_scripts', 'add_my_scripts' );
add_action( 'admin_menu', 'add_my_plugin_menu' );
