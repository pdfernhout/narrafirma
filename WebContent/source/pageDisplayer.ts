import navigationPane = require("./navigationPane");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

// For tracking what page the application is on
var currentPageID = null;
var currentPageSpecification = null;
var currentPage;
var startPage;
var updateHashIfNeededForChangedState;

var panelBuilder: PanelBuilder;

var project;

var PageDisplayer: any = {
    controller: function(args) {
        console.log("PageDisplayer created");
    },
    
    view: function(controller, args) {
        var contentsDiv;
        
        console.log("&&&&&&&&&& view called in PageDisplayer", currentPageID);
        if (!currentPageID) {
            contentsDiv = m("div", "Starting up...");
        } else {
            // Create the display widgets for this page
            try {
                contentsDiv = m("div", {"class": "narrafirma-" + currentPageID}, [
                    m("div.narrafirma-page-name", currentPageSpecification.displayName),
                    panelBuilder.buildPanel(currentPageID, project.projectModel)
                ]);
            } catch (e) {
                console.log("ERROR: When trying to create page", currentPageID, e);
                // TODO: Translate
                // alert("Something when wrong trying to create this page");
                contentsDiv = m("div", "PROBLEM: Failed to build page: " + currentPageID);
            }
         }
        return m("div.pageContents", {key: "pageContents"}, contentsDiv);
    }
};

// Call this once at the beginning of the application
export function configurePageDisplayer(thePanelBuilder: PanelBuilder, theStartPage, theProject, updateHashIfNeededForChangedStateCallback) {
    panelBuilder = thePanelBuilder;
    startPage = theStartPage;
    project = theProject;
    updateHashIfNeededForChangedState = updateHashIfNeededForChangedStateCallback;
    
    m.mount(document.getElementById("pageDiv"), PageDisplayer);
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
        updateHashIfNeededForChangedState();
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
 
    // Just going to assume we will be redrawing later via Mithril...
    
    // Make sure the hash is pointing to this page if this is not a forced refresh
    if (currentPageID !== pageID) {
        console.log("setting currentPageID to", pageID);
        currentPageID = pageID;
        currentPageSpecification = pageSpecification;
        panelBuilder.clientState.pageIdentifier = currentPageID;
    }
    
    // TODO: document.body.scrollTop = document.documentElement.scrollTop = 0;

    navigationPane.setCurrentPageSpecification(pageID, pageSpecification);

    m.redraw();
    
    // Setting the hash may trigger another call to this function eventually, but as the new page will already be set, it should not loop further
    updateHashIfNeededForChangedState();
}

export function getCurrentPageID() {
    return currentPageID;
}
