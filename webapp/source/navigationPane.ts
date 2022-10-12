import m = require("mithril");
import PanelSetup = require("./PanelSetup");
import Globals = require("./Globals");
import versions = require("./versions");

"use strict";

let panelSpecificationCollection;

let currentSectionID;
let currentPageSpecification;
let userIdentifier;

let navigationController = null;

/* jshint scripturl:true */
const launchHelpCommand = "javascript:narrafirma_helpClicked()";
const logoutCommand = "javascript:narrafirma_logoutClicked()";
const loginCommand = "javascript:narrafirma_loginClicked()";

const Navigation: any = {
    panelBuilder: null,
    
    controller: function(args) {
        this.pageID = null;
        this.pageSpecification = null;
        this.panelBuilder = Navigation.panelBuilder;
    },
    
    view: function(controller, args) {
        return m("div[id=narrafirma-navigation]", [
            m("span[id=narrafirma-name]", {
                "class": Globals.clientState().serverStatus(),
                "title": Globals.clientState().serverStatusText()
            }, "NarraFirma™"), // 
            //m("sup", {"class": "narrafirma-trademark"}, "TM"),
            //m("span[id=narrafirma-version]", "v" + versions.narrafirmaApplication),
            m("span[id=narrafirma-project-name]", Globals.project().projectNameOrNickname()),
            m("span[id=narrafirma-breadcrumbs]", buildBreadcrumbs(controller)),
            Globals.project().readOnly ? m("span[id=narrafirma-read-only]", 
                {title: "Project is read-only for this user. Local changes can be made, but they will not be saved on the server and will be lost if the page is reloaded."}, 
                "Read only") : [],
            // These next links float right and so are added in reverse order
            userIdentifier === "anonymous" ?
                m("a[id=narrafirma-login-link]", {href: loginCommand, title: "Log in (instead of being anonymous)"}, 'Log in') : 
                m("a[id=narrafirma-logout-link]", {href: logoutCommand, title: "Log out the current user"}, 'Log out (' + userIdentifier + ')'),
           
            m("a[id=narrafirma-help-link]", {href: launchHelpCommand, title: "Open online help for this page", "class": "narrafirma-help-link"}, "Help"),
            m("a[id=narrafirma-next-page]", {href: nextPageLink(), title: nextPageTitle(), "class": nextPageClass()}, "⇨"),
            m("a[id=narrafirma-previous-page]", {href: previousPageLink(), title:  previousPageTitle(), "class": previousPageClass()}, "⇦")
        ]);
    }
};

function previousPageTitle() {
    if (!currentPageSpecification || !currentPageSpecification.previousPageID) return "No previous page";
    const previousPage = panelSpecificationCollection.getPageSpecificationForPageID(currentPageSpecification.previousPageID);
    if (previousPage) return "Previous page (" + previousPage.displayName + ")";
    return "Previous page";
}

function previousPageClass() {
    if (!currentPageSpecification || !currentPageSpecification.previousPageID) return "narrafirma-link-disabled";
    return "narrafirma-link-enabled";
}

function previousPageLink() {
    if (!currentPageSpecification) return "#";
    return linkForPage(currentPageSpecification.previousPageID);
}

function nextPageTitle() {
    if (!currentPageSpecification || !currentPageSpecification.nextPageID) return "No next page";
    const nextPage = panelSpecificationCollection.getPageSpecificationForPageID(currentPageSpecification.nextPageID);
    if (nextPage) return "Next page (" + nextPage.displayName + ")";
    return "Next page";
}

function nextPageClass() {
    if (!currentPageSpecification || !currentPageSpecification.nextPageID) return "narrafirma-link-disabled";
    return "narrafirma-link-enabled";
}

function nextPageLink() {
    if (!currentPageSpecification) return "#";
    return linkForPage(currentPageSpecification.nextPageID);
}

export function initializeNavigationPane(thePanelSpecificationCollection, theUserIdentifier, panelBuilder) {
    panelSpecificationCollection = thePanelSpecificationCollection;
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
    const pageID = controller.pageID;
    const pageSpecification = controller.pageSpecification;
    
    currentPageSpecification = pageSpecification;
    
    if (!pageSpecification) return ["Starting up..."];

    const breadcrumbs = [];
    if (pageID !== PanelSetup.startPage()) {
        breadcrumbs.push(htmlForBreadcrumb(PanelSetup.startPage(), "Home"));
        breadcrumbs .push(" > ");
        // TODO: Should lookup name of section
        if (!pageSpecification.isHeader) {
            const sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID("page_" + pageSpecification.section);
            if (sectionPageSpecification) {
                breadcrumbs.push(htmlForBreadcrumb(sectionPageSpecification.id, sectionPageSpecification.displayName));
                breadcrumbs.push(" > ");
            } else {
                console.log("ERROR: could not find sectionPageSpecification for: ", pageSpecification.section, pageSpecification);
            }
        }
    }
    breadcrumbs.push(m("span", {id: "narrafirma-breadcrumb-current"}, pageSpecification.displayName));
    return breadcrumbs;
}

function linkForPage(pageIdentifier) {
    if (!pageIdentifier) return "javascript:void(0)";
    return "javascript:narrafirma_openPage(\'" + pageIdentifier + "\')";
}

function htmlForBreadcrumb(pageIdentifier, pageName) {
    return m("a", {href: linkForPage(pageIdentifier)}, pageName);
}

export function getCurrentPageSpecification() {
    return currentPageSpecification;
}