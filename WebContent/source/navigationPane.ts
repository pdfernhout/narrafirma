import m = require("mithril");

"use strict";

var panelSpecificationCollection;
var startPage;

var currentSectionID;
var currentPageSpecification;
var userIdentifier;

var navigationController = null;

/* jshint scripturl:true */
var launchHelpCommand = "javascript:narrafirma_helpClicked()";
var logoutCommand = "javascript:narrafirma_logoutClicked()";

var Navigation: any = {
    panelBuilder: null,
    
    controller: function(args) {
        this.pageID = null;
        this.pageSpecification = null;
        this.panelBuilder = Navigation.panelBuilder;
    },
    
    view: function(controller, args) {
        return m("div[id=narrafirma-navigation]", [
            m("span[id=narrafirma-name]", {
                "class": controller.panelBuilder.clientState.serverStatus,
                "title": controller.panelBuilder.clientState.serverStatusText
            }, m.trust("NarraFirma&#0153")),
            m("span[id=narrafirma-breadcrumbs]", m.trust(buildBreadcrumbs(controller))),
            m("a[id=narrafirma-help-link]", {href: launchHelpCommand}, "(Help)"),
            m("a[id=narrafirma-logout-link]", {href: logoutCommand}, 'Logout (' + userIdentifier + ')')
        ]);
    }
};

export function initializeNavigationPane(thePanelSpecificationCollection, theStartPage, theUserIdentifier, panelBuilder) {
    panelSpecificationCollection = thePanelSpecificationCollection;
    startPage = theStartPage;
    userIdentifier = theUserIdentifier;
    
    Navigation.panelBuilder = panelBuilder;
    navigationController = m.mount(document.getElementById("navigationDiv"), Navigation);
}
    
export function setCurrentPageSpecification(pageID, pageSpecification) {
    currentPageSpecification = pageSpecification;
    
    navigationController.pageID = pageID;
    navigationController.pageSpecification = pageSpecification;
}

function buildBreadcrumbs(controller) {
    var pageID = controller.pageID;
    var pageSpecification = controller.pageSpecification;
    
    currentPageSpecification = pageSpecification;
    
    if (!pageSpecification) return "Starting up...";

    var html = "";
    if (pageID !== startPage) {
        html = htmlForBreadcrumb(startPage, "Home");
        html += " > ";
        console.log("pageSpecification", pageSpecification);
        // TODO: Should lookup name of section
        if (!pageSpecification.isHeader) {
            var sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID("page_" + pageSpecification.section);
            if (sectionPageSpecification) {
                html += htmlForBreadcrumb(sectionPageSpecification.id, sectionPageSpecification.displayName);
                html += " > ";
            } else {
                console.log("ERROR: could not find sectionPageSpecification for: ", pageSpecification.section, pageSpecification);
            }
        }
    }
    html += '<span id="narrafirma-breadcrumb-current">' + pageSpecification.displayName + '</span>';
    return html;
}

function htmlForBreadcrumb(pageIdentifier, pageName) {
    return '<a href="javascript:narrafirma_openPage(\'' + pageIdentifier + '\')">' + pageName + '</a>';
}

export function getCurrentPageSpecification() {
    return currentPageSpecification;
}