define([
    "dijit/layout/ContentPane",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dijit/form/Select",
    "js/panelBuilder/translate",
    "js/panelBuilder/widgetSupport"
], function(
    ContentPane,
    domConstruct,
    domStyle,
    Select,
    translate,
    widgetSupport
) {
    "use strict";

    // TODO: Add page validation

    // Navigation widgets
    var navigationPane;
    var pageControlsPane;
    var homeButton;
    var pageNavigationSelect;
    var previousPageButton;
    var nextPageButton;

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

        homeButton = widgetSupport.newButton(pageControlsPane, "#button_home|Home", homeButtonClicked);
        homeButton.set("showLabel", false);
        // homeButton.set("iconClass", "dijitEditorIcon dijitEditorIconOutdent");
        homeButton.set("iconClass", "homeButtonImage");
        homeButton.set("title", translate("#button_home_title|Go to main dashboard"));

        // TODO: Select width should be determined from contents of select options using font metrics etc.
        pageNavigationSelect = newSpecialSelect(pageControlsPane, []);
        domStyle.set(pageNavigationSelect.domNode, "width", "400px");
        pageNavigationSelect.on("change", pageNavigationSelectChanged);

        previousPageButton = widgetSupport.newButton(pageControlsPane, "", previousPageClicked);
        previousPageButton.set("iconClass", "leftButtonImage");
        previousPageButton.set("title", translate("#button_previousPage", "Go to previous page"));

        nextPageButton = widgetSupport.newButton(pageControlsPane, "", nextPageClicked);
        nextPageButton.set("iconClass", "rightButtonImage");
        nextPageButton.set("title", translate("#button_nextPage", "Go to next page"));

        return pageControlsPane;
    }

    // TODO: somehow unify this with code in widget-questions-table?
    function newSpecialSelect(addToDiv, options) {
        var select = new Select({
            options: options
        });
        select.placeAt(addToDiv, "last");
        return select;
    }

    function homeButtonClicked() {
        console.log("homeButtonClicked");
        pageDisplayer.showPage(startPage);
    }

    function previousPageClicked() {
        // console.log("previousPageClicked");
        if (!currentPageSpecification) {
            // Should never get here
            alert("Something wrong with currentPageSpecification");
            return;
        }
        var previousPageID = currentPageSpecification.previousPageID;
        if (previousPageID) {
            pageDisplayer.showPage(previousPageID);
        } else {
            // Should never get here based on button enabling
            alert("At first page");
        }
    }

    function nextPageClicked() {
        // console.log("nextPageClicked");
        if (!currentPageSpecification) {
            // Should never get here
            alert("Something wrong with currentPageSpecification");
            return;
        }
        var nextPageID = currentPageSpecification.nextPageID;
        if (nextPageID) {
            pageDisplayer.showPage(nextPageID);
        } else {
            // Should never get here based on button enabling
            alert("At last page");
        }
    }

    function pageNavigationSelectChanged(pageID) {
        console.log("changing page to:", pageID);
        pageDisplayer.showPage(pageID);
    }

    // Calculate title to be displayed in navigation select
    function titleForPanel(panelSpecification) {
        var title = translate(panelSpecification.id + "::title", panelSpecification.displayName);
        if (panelSpecification.isHeader) {
            title = "<i>" + title + "</i>";
        } else {
            title = "&nbsp;&nbsp;&nbsp;&nbsp;" + title;
        }
        if (panelSpecification.displayType !== "page") {
            title += " SPECIAL: " + panelSpecification.displayType;
        }
        return title;
    }

    function pageSelectOptionsForSection(sectionHeaderPageID) {
        if (!sectionHeaderPageID) throw new Error("sectionHeaderPageID cannot be null or empty");
        console.log("pageSelectOptionsForSection", sectionHeaderPageID);

        // TODO: Rethink if this should be asking the pageDisplayer for this information about navigation
        var pageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(sectionHeaderPageID);

        var options = [];
        var title = titleForPanel(panelSpecificationCollection.getPageSpecificationForPageID(sectionHeaderPageID));
        // It seems like a Dojo "select" widget has a limitation where it can only take strings as values.
        // This means we need to look up page definitions indirectly based on a pageID usind a PanelSpecificationCollection instance.
        options.push({label: title, value: sectionHeaderPageID});
        _.forEach(pageIDs, function (pageID) {
            title = titleForPanel(panelSpecificationCollection.getPageSpecificationForPageID(pageID));
            options.push({label: title, value: pageID});
        });
        return options;
    }

    function setCurrentPageSpecification(pageID, pageSpecification) {
        if (pageSpecification === currentPageSpecification) return;

        // console.log("!!!!!!!!! +++++++++++++++++ setCurrentPageSpecification", pageSpecification);
        // console.log("callers", new Error());
        currentPageSpecification = pageSpecification;
        previousPageButton.setDisabled(!pageSpecification.previousPageID);
        nextPageButton.setDisabled(!pageSpecification.nextPageID);

        // Ensure the navigation dropdown has the list for this section
        if (currentSectionID !== pageSpecification.section) {
            currentSectionID = pageSpecification.section;
            // console.log("getting options for", pageSpecification.sectionHeaderPageID, pageSpecification);
            var options = pageSelectOptionsForSection(pageSpecification.sectionHeaderPageID);
            // console.log("options", options);
            pageNavigationSelect.set("options", options);
        }

        // Ensure select is pointing to this page; this may trigger an update but it should be ignored as we're already on this page
        pageNavigationSelect.set("value", pageID);
    }

    return {
        createNavigationPane: createNavigationPane,
        setCurrentPageSpecification: setCurrentPageSpecification
    };
});