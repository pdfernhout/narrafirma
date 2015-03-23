define([
    "dijit/layout/ContentPane",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/hash",
    "js/navigationPane",
    "js/panelBuilder/translate"
], function(
    ContentPane,
    domain,
    domConstruct,
    domStyle,
    hash,
    navigationPane,
    translate
) {
    "use strict";

    // For tracking what page the application is on
    var currentPageID;
    var currentPage;

    var panelSpecificationCollection;
    var panelBuilder;

    // Call this once at the beginning of the application
    function configure(thePanelSpecificationCollection, thePanelBuilder) {
        panelSpecificationCollection = thePanelSpecificationCollection;
        panelBuilder = thePanelBuilder;
    }

    function getPageSpecification(pageID) {
        // For now, any "page" defined in the panelSpecificationCollection is available
        return panelSpecificationCollection.getPageSpecificationForPageID(pageID);
    }

    // TODO: Rethink if this should be here -- currently called by navigationPane
    function getChildPageIDListForHeaderID(headerID) {
        return panelSpecificationCollection.getChildPageIDListForHeaderID(headerID);
    }

    function showPage(pageID, forceRefresh) {
        if (currentPageID === pageID && !forceRefresh) return;

        var pageSpecification = getPageSpecification(pageID);
        if (!pageSpecification) {
            console.log("no such page", pageID);
            alert("No such page: " + pageID);
            return;
        }

        // Hide the current page temporarily
        domStyle.set("pageDiv", "display", "none");

        if (currentPageID && currentPage) {
            // domStyle.set(currentPageID, "display", "none");
            console.log("destroying", currentPageID, currentPage);
            currentPage.destroyRecursive();
            domConstruct.destroy(currentPage.domNode);
        }

        currentPage = createPage(pageID, true);

        currentPageID = pageID;
        hash(currentPageID);

        // Show the current page again
        domStyle.set("pageDiv", "display", "block");

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        // Because the page was hidden when created, all the grids need to be resized so grid knows how tall to make header so it is not overwritten
        currentPage.resize();

        // Ensure navigation select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
        navigationPane.setCurrentPageSpecification(pageID, pageSpecification);
    }

    function createPage(pageID, visible) {
        console.log("createPage", pageID);

        // TODO: Fix this for multi-page saving and loading in different documents
        var modelForPage = domain.projectAnswers;

        var pageSpecification = getPageSpecification(pageID);

        if (!pageSpecification) {
            console.log("ERROR: No definition for page: ", pageID);
            return null;
        }

        var pagePane = new ContentPane({
            "id": pageID,
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

        panelBuilder.buildPanel(pageID, pagePane, modelForPage);

        // console.log("about to set visibility", pageID);
        if (visible) {
            domStyle.set(pageID, "display", "block");
        } else {
            domStyle.set(pageID, "display", "none");
        }

        return pagePane;
    }

    function getCurrentPageID() {
        return currentPageID;
    }

    return {
        configure: configure,
        showPage: showPage,
        getCurrentPageID: getCurrentPageID,
        getPageSpecification: getPageSpecification,

        // TODO: Rethink whether this should be here -- currently called from navigationPane
        getChildPageIDListForHeaderID: getChildPageIDListForHeaderID
    };
});