import navigationPane = require("./navigationPane");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import Project = require("./Project");
import m = require("mithril");
import PanelSetup = require("./PanelSetup");
import ClientState = require("./ClientState");

"use strict";

// For tracking what page the application is on
var currentPageID = null;
var currentPageSpecification = null;
var currentPage;

var panelBuilder: PanelBuilder;

var project: Project;
var clientState: ClientState;

var PageDisplayer: any = {
    controller: function(args) {
        // console.log("PageDisplayer created");
    },
    
    view: function(controller, args) {
        var contentsDiv;
        
        // console.log("========== view called in PageDisplayer ==========", currentPageID);
            
        // Setting the hash may trigger another call to the showPage function eventually, but as the new page will already be set, it should not loop further
        clientState.updateHashIfNeededForChangedClientState();
        
        if (!currentPageID) {
            contentsDiv = m("div", "Starting up...");
        } else {
            // Create the display widgets for this page
            try {
                contentsDiv = m("div", {"class": "narrafirma-" + currentPageID}, [
                    m("div.narrafirma-page-name", currentPageSpecification.displayName),
                    panelBuilder.buildPanel(currentPageID, project.projectIdentifier)
                ]);
            } catch (e) {
                console.log("ERROR: When trying to view page", currentPageID, e);
                // TODO: Translate
                // alert("Something when wrong trying to create this page");
                contentsDiv = m("div", "PROBLEM: Failed to view page: " + currentPageID);
            }
         }
        return m("div.pageContents", {key: "pageContents"}, contentsDiv);
    }
};

// Call this once at the beginning of the application
export function configurePageDisplayer(thePanelBuilder: PanelBuilder, theProject, theClientState) {
    panelBuilder = thePanelBuilder;
    project = theProject;
    clientState = theClientState;
    
    m.mount(document.getElementById("pageDiv"), PageDisplayer);
}

export function showPage(pageID, forceRefresh = false, isRedrawAlreadyQueued = false) {
    // console.log("showPage", pageID, forceRefresh);
    
    if (!pageID) pageID = PanelSetup.startPage();
    if (currentPageID === pageID && !forceRefresh) {
        // console.log("Page is already current; returning");
        return;
    }
    
    var pageSpecification;
    try {
        pageSpecification = panelBuilder.getPageSpecificationForPageID(pageID);
    } catch (e) {
        console.log("Problem finding pageSpecification for", pageID);
    }
    
    var badPage = null;
    
    // Assume that if we have a panel specification for a page that it is OK to go to it
    if (!pageSpecification || pageSpecification.displayType !== "page") {
        console.log("no such page", pageID);
        alert("No such page: " + pageID);
        badPage = pageID;
        // Put back the hash if there was a valid one there already
        if (currentPageID !== null && currentPageID !== pageID) {
            pageID = currentPageID;
        } else {
            pageID = PanelSetup.startPage();
        }
        // clientState.updateHashIfNeededForChangedClientState();
        try {
            pageSpecification = panelBuilder.getPageSpecificationForPageID(pageID);
        } catch (e) {
            console.log("Problem finding pageSpecification for", pageID);
        }
    }
 
    // Just going to assume we will be redrawing later via Mithril...
    
    // Make sure the hash is pointing to this page if this is not a forced refresh
    if (currentPageID !== pageID || badPage) {
        // console.log("setting currentPageID to", pageID);
        currentPageID = pageID;
        currentPageSpecification = pageSpecification;
        clientState.pageIdentifier(currentPageID);
    }
    
    navigationPane.setCurrentPageSpecification(pageID, pageSpecification);

    if (!isRedrawAlreadyQueued) {
        try {
            m.redraw();
        } catch (e) {
            console.log("ERROR: When trying to redraw page", currentPageID, e);
        }
    }
}

export function getCurrentPageID() {
    return currentPageID;
}
