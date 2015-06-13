define([
    "dijit/layout/ContentPane",
    "dojo/dom-construct"
], function (ContentPane, domConstruct) {
    "use strict";
    // TODO: Add page validation
    // Navigation widgets
    var navigationPane;
    var pageControlsPane;
    var breadcrumbsSpan;
    var pageDisplayer;
    var panelSpecificationCollection;
    var startPage;
    var currentSectionID;
    var currentPageSpecification;
    function createNavigationPane(thePageDisplayer, thePanelSpecificationCollection, theStartPage) {
        console.log("thePageDisplayer", thePageDisplayer);
        pageDisplayer = thePageDisplayer;
        panelSpecificationCollection = thePanelSpecificationCollection;
        startPage = theStartPage;
        // Startup needs to be called here to ensure a top level content pane is started
        navigationPane = new ContentPane({}, "navigationDiv");
        navigationPane.startup();
        // Any items like buttons added to the navigationPane will have startup() called automatically,
        // since the navigationPane they are being added to has already been started
        // Document controls
        // Page controls
        pageControlsPane = new ContentPane();
        pageControlsPane.placeAt(navigationPane, "last");
        domConstruct.place('<span id="narrafirma-name">NarraFirma&#0153;</span>', pageControlsPane.domNode);
        breadcrumbsSpan = domConstruct.place('<span id="narrafirma-breadcrumbs"><a href="javascript:narrafirma_openPage(\'page_dashboard\')">Home</a></span>', pageControlsPane.domNode);
        domConstruct.place('<a id="narrafirma-help-link" href="javascript:narrafirma_helpClicked()">(Help)</a>', pageControlsPane.domNode);
        return pageControlsPane;
    }
    function htmlForBreadcrumb(pageIdentifier, pageName) {
        return '<a href="javascript:narrafirma_openPage(\'' + pageIdentifier + '\')">' + pageName + '</a>';
    }
    function setCurrentPageSpecification(pageID, pageSpecification) {
        if (pageSpecification === currentPageSpecification)
            return;
        currentPageSpecification = pageSpecification;
        // Update breadcrumbs
        console.log("breadcrumbsSpan", breadcrumbsSpan);
        var html = "";
        if (pageID !== startPage) {
            html = htmlForBreadcrumb(startPage, "Home");
            html += " > ";
            console.log("pageSpecification", pageSpecification);
            // TODO: Should lookup name of section
            if (!pageSpecification.isHeader) {
                var sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID("page_" + pageSpecification.section);
                html += htmlForBreadcrumb(sectionPageSpecification.id, sectionPageSpecification.displayName);
                html += " > ";
            }
        }
        html += '<span id="narrafirma-breadcrumb-current">' + pageSpecification.displayName + '</span>';
        breadcrumbsSpan.innerHTML = '<span id="narafirma-breadcrumbs">' + html + '</span>';
    }
    function getCurrentPageSpecification() {
        return currentPageSpecification;
    }
    return {
        createNavigationPane: createNavigationPane,
        setCurrentPageSpecification: setCurrentPageSpecification,
        getCurrentPageSpecification: getCurrentPageSpecification
    };
});
