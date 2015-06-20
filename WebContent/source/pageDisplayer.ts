import ContentPane = require("dijit/layout/ContentPane");
import domClass = require("dojo/dom-class");
import domConstruct = require("dojo/dom-construct");
import domStyle = require("dojo/dom-style");
import navigationPane = require("./navigationPane");
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

var PageDisplayer: any = {
    controller: function(args) {
    },
    
    view: function(controller, args) {
        console.log("&&&&&&&&&& view called in PageDisplayer", currentPageID);
        if (!currentPageID) {
            return m("div", "Starting up...");
        }
        // Create the display widgets for this page
        try {
            return panelBuilder.buildPanel(currentPageID, project.projectModel);
        } catch (e) {
            console.log("ERROR: When trying to create page", currentPageID, e);
            // TODO: Translate
            // alert("Something when wrong trying to create this page");
        }
        return m("div", "PROBLEM: Failed to build page: " + currentPageID);
    }
}

// Call this once at the beginning of the application
export function configurePageDisplayer(thePanelBuilder: PanelBuilder, theStartPage, theProject) {
    panelBuilder = thePanelBuilder;
    startPage = theStartPage;
    project = theProject;
    
    m.mount(document.getElementById("pageDiv"), PageDisplayer);
}

export function redraw() {
    m.redraw();
}

export function showPage(pageID, forceRefresh = false) {
    console.log("showPage", pageID, forceRefresh);
    
    if (!pageID) pageID = startPage;
    if (currentPageID === pageID && !forceRefresh) {
        console.log("Page is already current; returning");
        return;
    }
    
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
            panelBuilder.clientState.pageIdentifier = currentPageID;
        } else {
            panelBuilder.clientState.pageIdentifier = startPage;
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
            if (currentPageID !== null && currentPageID !== pageID) panelBuilder.clientState.pageIdentifier = currentPageID);
            return;
        }
    }
    */
 
    // Hide the current page temporarily
    // domStyle.set("pageDiv", "display", "none");

    // Just going to assume we will be redrawing later via Mithril...
    
    // Make sure the hash is pointing to this page if this is not a forced refresh
    if (currentPageID !== pageID) {
        console.log("setting currentPageID to", pageID);
        currentPageID = pageID;
        panelBuilder.clientState.pageIdentifier = currentPageID;
    }
    
    // Show the current page again
    // domStyle.set("pageDiv", "display", "block");
    
    // TODO: document.body.scrollTop = document.documentElement.scrollTop = 0;

    // Ensure navigation select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
    // TODO: navigationPane.setCurrentPageSpecification(pageID, pageSpecification);
    
    // Because the page was hidden when created, all the grids need to be resized so grid knows how tall to make header so it is not overwritten
    // currentPage.resize();
    // domClass.add(currentPage.domNode, "narrafirma-" + pageID);
}

export function getCurrentPageID() {
    return currentPageID;
}

export function getCurrentPageWidgets() {
    return currentPageWidgets;
}
