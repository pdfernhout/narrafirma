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
    controller: function(args) {
        this.pageID = null;
        this.pageSpecification = null;
    },
    
    view: function(controller, args) {
        return m("div[id=narrafirma-navigation]", [
            m("span[id=narrafirma-name]", m.trust("NarraFirma&#0153")),
            m("span[id=narrafirma-breadcrumbs]", m.trust(buildBreadcrumbs(controller))),
            m("a[id=narrafirma-help-link]", {href: launchHelpCommand}, "(Help)"),
            m("a[id=narrafirma-logout-link]", {href: logoutCommand}, 'Logout (' + userIdentifier + ')')
        ]);
    }
};

export function initializeNavigationPane(thePanelSpecificationCollection, theStartPage, theUserIdentifier) {
    panelSpecificationCollection = thePanelSpecificationCollection;
    startPage = theStartPage;
    userIdentifier = theUserIdentifier;
    
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
    return html;
}

function htmlForBreadcrumb(pageIdentifier, pageName) {
    return '<a href="javascript:narrafirma_openPage(\'' + pageIdentifier + '\')">' + pageName + '</a>';
}

export function getCurrentPageSpecification() {
    return currentPageSpecification;
}