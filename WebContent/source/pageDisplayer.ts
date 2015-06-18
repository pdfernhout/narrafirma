import ContentPane = require("dijit/layout/ContentPane");
import domClass = require("dojo/dom-class");
import domConstruct = require("dojo/dom-construct");
import domStyle = require("dojo/dom-style");
import navigationPane = require("./navigationPane");
import Standby = require("dojox/widget/Standby");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

// For tracking what page the application is on
var currentPageID = null;
var currentPage;

var startPage;

var panelBuilder: PanelBuilder;
var currentPageWidgets;

var project;

var standby;
var standbyStartTimer;

var standbyStartWait_ms = 100;

// Call this once at the beginning of the application
export function configurePageDisplayer(thePanelBuilder: PanelBuilder, theStartPage, theProject) {
    panelBuilder = thePanelBuilder;
    startPage = theStartPage;
    project = theProject;
    
    // TODO: Since pageDiv is hidden while it is being built, hide the navigationDiv to provide feedback
    // TODO: The next line is to avoid TypeScript error on calling constructor
    var KludgeStandby: any = Standby;
    standby = new KludgeStandby({target: "navigationDiv"});
    document.body.appendChild(standby.domNode);
    standby.startup();
}

function startStandby() {
    // Start standby if the data load is taking longer then standbyStartWait_ms time
    standbyStartTimer = window.setTimeout(function() {
        console.log("Start standby timer");
        standby.show();
        standbyStartTimer = null;
    }, standbyStartWait_ms);
}

function stopStandby() {
    if (standbyStartTimer) {
        console.log("Clear standby timer start");
        window.clearTimeout(standbyStartTimer);
        standbyStartTimer = null;
    }
    console.log("hiding standby if it is started");
    standby.hide();
}

export function showPage(pageID, forceRefresh = false) {
    if (!pageID) pageID = startPage;
    if (currentPageID === pageID && !forceRefresh) return;

    var pageSpecification;
    try {
        pageSpecification = panelBuilder.getPageSpecificationForPageID(pageID);
    } catch (e) {
        console.log("Problem finding pageSpecification for", pageID);
    }
    
    // Assume that if we have a panel specification for a page that it is OK to go to it
    if (!pageSpecification || pageSpecification.displayType !== "page") {
        console.log("no such page", pageID);
        alert("No such page: " + pageID);
        // Put back the hash if there was a valid one there already
        if (currentPageID !== null && currentPageID !== pageID) {
            panelBuilder.clientState.set("currentPageIdentifier", currentPageID);
        } else {
            panelBuilder.clientState.set("currentPageIdentifier", startPage);
        }
        return;
    }
    
    // TODO: Check for unsaved changes before changing page (like in Grid)
    /*
    if (currentPageID !== null && hasUnsavedChangesForCurrentPage()) {
        // TODO: Fix this so requests you either revert or save changes first?
        // TODO: Translate
        var confirmResult = confirm("You have unsaved changes. Proceed anyway?");
        if (!confirmResult) {
            // Put back the old hash if it is valid and changed
            if (currentPageID !== null && currentPageID !== pageID) panelBuilder.clientState.set("currentPageIdentifier", currentPageID);
            return;
        }
    }
    */

    // Get ready to put up a standby widget in case this all takes a long time, especially loading the data from the server
    startStandby();
    
    // Hide the current page temporarily
    domStyle.set("pageDiv", "display", "none");

    // Get rid of the old page using dojo destroy in order to prevent memory leaks
    if (currentPageID && currentPage) {
        // domStyle.set(currentPageID, "display", "none");
        console.log("destroying", currentPageID, currentPage);
        currentPage.destroyRecursive();
        domConstruct.destroy(currentPage.domNode);
    }
    
    // Get ready to create a model for this page if we have a model for it
    var pageModelName = pageSpecification.modelClass;
    if (pageModelName === undefined) {
        console.log("ERROR: Page model name is not set in", pageID, pageSpecification);
        stopStandby();
        // TODO: Translate
        alert("Something when wrong trying to create the model for this page");
        return;
    }

    var modelForPage = project.projectModel;

    // Create the display widgets for this page
    try {
        currentPage = createPage(pageID, pageSpecification, modelForPage);
    } catch (e) {
        console.log("ERROR: When trying to create page", pageID, e);
        stopStandby();
        // TODO: Translate
        alert("Something when wrong trying to create this page");
        return;
    }

    // Make sure the hash is pointing to this page if this is not a forced refresh
    if (currentPageID !== pageID) {
        console.log("setting currentPageID to", pageID);
        currentPageID = pageID;
        panelBuilder.clientState.set("currentPageIdentifier", currentPageID);
    }
    
    finishShowingPage(pageID, pageSpecification);
    
    // TODO: What if standby reset fails for some reasonn?
}

function finishShowingPage(pageID, pageSpecification) { 
    // Show the current page again
    domStyle.set("pageDiv", "display", "block");
    
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    // Ensure navigation select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
    navigationPane.setCurrentPageSpecification(pageID, pageSpecification);
    
    // Because the page was hidden when created, all the grids need to be resized so grid knows how tall to make header so it is not overwritten
    currentPage.resize();
    domClass.add(currentPage.domNode, "narrafirma-" + pageID);
    
    stopStandby();
}

// Create all the widgets for the current page using the panelBuilder which builds the page from the pageSpecification
function createPage(pageID, pageSpecification, modelForPage) {
    console.log("createPage", pageID);
    
    var pagePane = new ContentPane({
        // Shorten width so grid scroll bar shows up not clipped
        // Also, looks like nested ContentPanes tend to walk off the right side of the page for some reason
        // CFK changed 94% to 99% - still looks okay when scrolling and 94% left noticeable gap on right side
        style: "width: 99%",
        display: "none" // "block" //
    });

    // console.log("about to place pane", pageID);
    // Dojo seems to require these pages be in the visual hierarchy before some components like grid that are added to them are have startUp called.
    // Otherwise the grid header is not sized correctly and will be overwritten by data
    // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
    pagePane.placeAt("pageDiv", "last");
    
    pagePane.startup();
    
    var title = '<div class="narrafirma-page-name">' + pageSpecification.displayName + '</div>';
    
    var titlePane = new ContentPane({
        content: title
    });
    
    titlePane.placeAt(pagePane);

    // console.log("Made content pane", pageID);

    try {
        // Tell the panelBuilder to create all the widgets for this page
        currentPageWidgets = panelBuilder.buildPanel(pageID, pagePane, modelForPage);
    } catch (e) {
        console.log("Error when trying to build panel", pageID, modelForPage, e);
        // TODO: Translate
        alert("Something went wrong when trying to build this page.\nCheck the console for details");
    }
    
    // TODO: No removal done for old widgets?
    m.render(pagePane.domNode, currentPageWidgets);

    return pagePane;
}

export function getCurrentPageID() {
    return currentPageID;
}

export function getCurrentPageWidgets() {
    return currentPageWidgets;
}
