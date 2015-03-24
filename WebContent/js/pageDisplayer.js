define([
    "dijit/layout/ContentPane",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "js/navigationPane",
    "dojox/widget/Standby",
    "js/storage",
    "js/panelBuilder/translate"
], function(
    ContentPane,
    domain,
    domConstruct,
    domStyle,
    hash,
    navigationPane,
    Standby,
    storage,
    translate
) {
    "use strict";

    // For tracking what page the application is on
    var currentPageID = null;
    var currentPage;

    var panelBuilder;
    
    var standby;
    var standbyStartTimer;
    
    var standbyStartWait_ms = 100;

    // Call this once at the beginning of the application
    function configurePageDisplayer(thePanelBuilder) {
        panelBuilder = thePanelBuilder;
        
        // TODO: Since pageDiv is hidden while it is being built, hide the navigationDiv to provide feedback
        standby = new Standby({target: "navigationDiv"});
        document.body.appendChild(standby.domNode);
        standby.startup();
    }

    function showPage(pageID, forceRefresh) {
        if (!pageID) pageID = domain.startPage;
        if (currentPageID === pageID && !forceRefresh) return;

        var pageSpecification = domain.getPageSpecification(pageID);
        
        // Assume that if we have a panel specification for a page that it is OK to go to it
        if (!pageSpecification || pageSpecification.displayType !== "page") {
            console.log("no such page", pageID);
            alert("No such page: " + pageID);
            // Put back the hash if there was a valid one there already
            if (currentPageID !== null && currentPageID !== pageID) hash(currentPageID);
            return;
        }
        
        if (currentPageID !== null && domain.hasUnsavedChangesForCurrentPage()) {
            // TODO: Fix this so requests you either revert or save changes first?
            // TODO: Translate
            var confirmResult = confirm("You have unsaved changes. Proceed anyway?");
            if (!confirmResult) {
                // Put back the old hash if it is valid and changed
                if (currentPageID !== null && currentPageID !== pageID) hash(currentPageID);
                return;
            }
        }

        // Start standby if the data load is taking longer then standbyStartWait_ms time
        standbyStartTimer = window.setTimeout(function() {
            console.log("Start standby timer");
            standby.show();
            standbyStartTimer = null;
        }, standbyStartWait_ms);
        
        // Hide the current page temporarily
        domStyle.set("pageDiv", "display", "none");

        if (currentPageID && currentPage) {
            // domStyle.set(currentPageID, "display", "none");
            console.log("destroying", currentPageID, currentPage);
            currentPage.destroyRecursive();
            domConstruct.destroy(currentPage.domNode);
        }

        currentPage = createPage(pageID, true);

        if (currentPageID !== pageID) {
            console.log("setting currentPageID to", pageID);
            currentPageID = pageID;
            hash(currentPageID);
        }
        
        // Load the data for the current page
        // TODO: Improve this to be per page
        // TODO: Add some kind of please wait while loading...
        storage.loadLatestProjectVersion(function (error, content, envelope) {
            console.log("loaded data", error, content, envelope);
            
            if (!error) {
                domain.changeCurrentPageData(envelope);
            } else {
                console.log("ERROR: Problem loading data for page", pageID);
                // TODO: Need to distinguish if just starting out and no data file for page from some server issue
                alert("Problem loading data for page");
            }
            
            if (standbyStartTimer) {
                console.log("Clear standby timer start");
                window.clearTimeout(standbyStartTimer);
                standbyStartTimer = null;
            }
            console.log("hiding standby if it is started");
            standby.hide();
            
            // Show the current page again
            domStyle.set("pageDiv", "display", "block");

            document.body.scrollTop = document.documentElement.scrollTop = 0;

            // Ensure navigation select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
            navigationPane.setCurrentPageSpecification(pageID, pageSpecification);
            
            // Because the page was hidden when created, all the grids need to be resized so grid knows how tall to make header so it is not overwritten
            currentPage.resize();
        });
        
        // TODO: What if standby reset fails for some reason, like a problem with loadLastestProjectVersion?
    }

    function createPage(pageID) {
        console.log("createPage", pageID);

        var pageSpecification = domain.getPageSpecification(pageID);
        
        var pageModelName = pageSpecification.modelClass;
        if (!pageModelName) {
            console.log("Page model name is not set in", pageID, pageSpecification);
            throw new Error("Page model is not defined for " + pageID);
        }
        domain.changeCurrentPageModel(pageModelName);
        var modelForPage = domain.currentPageModel;
        
        // TODO: Need to load the data from the server or check for it in the cache!!!

        if (!pageSpecification) {
            console.log("ERROR: No definition for page: ", pageID);
            return null;
        }

        var pagePane = new ContentPane({
            title: pageSpecification.title,
            // Shorten width so grid scroll bar shows up not clipped
            // Also, looks like nested ContentPanes tend to walk off the right side of the page for some reason
            style: "width: 94%",
            display: "none" // "block" //
        });

        // console.log("about to place pane", pageID);
        // Dojo seems to require these pages be in the visual hierarchy before some components like grid that are added to them are have startUp called.
        // Otherwise the grid header is not sized correctly and will be overwritten by data
        // This is as opposed to what one might think would reduce resizing and redrawing by adding the page only after components are added
        pagePane.placeAt("pageDiv", "last");
        pagePane.startup();

        // console.log("Made content pane", pageID);

        try {
            panelBuilder.buildPanel(pageID, pagePane, modelForPage);
        } catch (e) {
            console.log("Error when trying to build panel", pageID, modelForPage, e);
            // TODO: Translate
            alert("Something went wrong when trying to display this page.\nCheck the console for details");
        }

        return pagePane;
    }

    function getCurrentPageID() {
        return currentPageID;
    }

    return {
        configurePageDisplayer: configurePageDisplayer,
        showPage: showPage,
        getCurrentPageID: getCurrentPageID,
    };
});