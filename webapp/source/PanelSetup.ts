
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");
import translate = require("./panelBuilder/translate");
import m = require("mithril");

"use strict";

// The home page -- should be a constant
const _startPage = "page_dashboard";

// This will hold information about all the panels used
const _panelSpecificationCollection = new PanelSpecificationCollection();

export function startPage(): string {
    return _startPage;
}

export function panelSpecificationCollection() {
    return _panelSpecificationCollection;
}

function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {

    function addPageChangeButton(newPageID, idExtra, prompt, displayIconClass) {
        // TODO: Translate
        if (displayIconClass !== "homeButtonImage") {
            const sectionPageSpecification = _panelSpecificationCollection.getPageSpecificationForPageID(newPageID);
            prompt += sectionPageSpecification.displayName;
        }
        let iconPosition = "";
        let arrowChar = "";
        if (displayIconClass === "leftButtonImage") {
            iconPosition = "left";
            arrowChar = "⇦ ";
            prompt = arrowChar + prompt;
        } else if (displayIconClass === "rightButtonImage") {
            iconPosition = "right";
            arrowChar = " ⇨";
            prompt = prompt + arrowChar;
        } 
        const returnToDashboardButtonSpecification = {
            "id": pageID + idExtra,
            "valueType": "none",
            "displayPrompt": prompt,
            "displayType": "button",
            "displayClass": "narrafirma-page-change-button",
            "displayConfiguration": {
                "action": "guiOpenSection",
                "section": newPageID
            },
            displayIconClass: (displayIconClass == "homeButtonImage") ? displayIconClass : null,
            displayPreventBreak: true,
            displayIconPosition: iconPosition
        };
        _panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, returnToDashboardButtonSpecification); 
    }
    
    if (pageSpecification.section !== "dashboard") {
        if (!pageSpecification.isHeader) {
            // TODO: Change the id of this field to have notes or reminder
            // Regular page -- add a footer where the page status can be set
            const statusEntryID = pageID + "_reminders";
            const completionStatusEntryFieldSpecification = {
                id: statusEntryID,
                valueType: "string",
                displayType: "textarea",
                displayName: "Reminders",
                displayClass: "narrafirma-reminder",
                displayPrompt: translate(
                    "#dashboard_status_entry::prompt",
                    "You can enter <strong>reminders</strong> about this page here. They will appear on this section's home page."
                )
            };
            _panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusEntryFieldSpecification);
        } else {
            // Dashboard page
            // Put in dashboard
            let childPageIDs = _panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
            if (!childPageIDs) childPageIDs = [];

            // Add a link (plus explanation) to this page for each child page in the section
            for (let childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                const childPageID = childPageIDs[childPageIndex];
                const statusViewID = childPageID + "_reminders_dashboard";
                const childPageSpecification = _panelSpecificationCollection.getPageSpecificationForPageID(childPageID);
                if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                if (childPageSpecification && childPageSpecification.displayType === "page") {
                    let prompt = translate(childPageID + "::title", childPageSpecification.displayName);
                    const properties: any = { href: "javascript:narrafirma_openPage('" + childPageID + "')" }
                    const explanationDiv = m("div.narrafirma-dashboard-page-link-explanation", childPageSpecification.pageExplanation);
                    prompt = m("div.narrafirma-dashboard-page-link", [m("a", properties, prompt), explanationDiv]);
                    if (childPageSpecification.headerAbove) { 
                        prompt = [m("div.narrafirma-dashboard-header", childPageSpecification.headerAbove), prompt]; 
                    }
                    // + " " + translate("#dashboard_status_label", "reminders:")
                    // prompt = prompt  + " ";
                    const completionStatusDisplayFieldSpecification = {
                        id: statusViewID,
                        valueType: "none",
                        displayType: "questionAnswer",
                        displayPrompt: prompt,
                        displayConfiguration: childPageID + "_reminders"
                    };
                    _panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusDisplayFieldSpecification);  
                }
            }
        }
    
        // Add button at bottom of each page to move to previous
        if (pageSpecification.previousPageID) {
            // TODO: Translate
            addPageChangeButton(pageSpecification.previousPageID, "_previousPageButton", "", "leftButtonImage");
        } else {
            addPageChangeButton(_startPage, "_returnToDashboardButton", "Home", "homeButtonImage");
        }
   
        // Add button at bottom of each page to move forward
        if (pageSpecification.nextPageID) {
            addPageChangeButton(pageSpecification.nextPageID, "_nextPageButton", "", "rightButtonImage");
        } else {
            addPageChangeButton(_startPage, "_returnToDashboardButton", "Home", "homeButtonImage");
        }
    }
}

export function processAllPanels() {
    const panels = _panelSpecificationCollection.buildListOfPanels();
    
    let lastPageID = null;
    let panelIndex;
    let panel;
    
    // Loop to setup navigation
    for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
        panel = panels[panelIndex];
        
        // For panels that are a "page", add to top level pages choices and set up navigation
        if (panel.displayType === "page") {
            // Make it easy to lookup previous and next pages from a page
            if (!panel.isHeader) {
                const previousPage = _panelSpecificationCollection.getPageSpecificationForPageID(lastPageID);
                previousPage.nextPageID = panel.id;
                panel.previousPageID = lastPageID;
            }
            lastPageID = panel.id;
        }
    }
    
    let lastHeader = null;
    let lastSection = null;
    
    // A separate loop is needed here to ensure page navigation links have been set up when determining additional buttons for pages
    for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
        panel = panels[panelIndex];
        
        if (panel.isHeader) {
            lastHeader = panel.id;
            lastSection = panel.section;
        }
        
        // For panels that are a "page", add extra buttons
        if (panel.displayType === "page") {
            addExtraFieldSpecificationsForPageSpecification(panel.id, panel);
        }
        
        panel.helpSection = lastSection;
        panel.helpPage = panel.id;
        panel.sectionHeaderPageID = lastHeader;
        
        for (let fieldIndex = 0; fieldIndex < panel.panelFields.length; fieldIndex++) {
            const fieldSpec = panel.panelFields[fieldIndex];
            fieldSpec.helpSection = lastSection;
            fieldSpec.helpPage = panel.id;
        }
    }
}

// TODO: Temporary for generating JSON navigation data from AMD module
function generateNavigationDataInJSON() {
    const sections = [];
    let sectionBeingProcessed;
    let pageBeingProcessed;
    const allPanels = _panelSpecificationCollection.buildListOfPanels();
    allPanels.forEach(function(panel) {
        if (panel.isHeader) {
            if (sectionBeingProcessed) sections.push(sectionBeingProcessed);
            sectionBeingProcessed = {
                section: panel.section,
                sectionName: panel.displayName,
                pages: []
            };
        }
        const navigationInfo = {
            panelID: panel.id,
            panelName: panel.displayName
        };
        if (panel.displayType === "page") {
            sectionBeingProcessed.pages.push(navigationInfo);
            pageBeingProcessed = navigationInfo;
        } else {
            if (!pageBeingProcessed.extraPanels) pageBeingProcessed.extraPanels = [];
            pageBeingProcessed.extraPanels.push(navigationInfo);
        }
    });
}

// TODO: For helping create all the models -- temporary
function printModels() {
    console.log("-------------------------------------------------");
    console.log("panelSpecificationCollection", _panelSpecificationCollection);
    
    console.log("models", _panelSpecificationCollection.modelClassToModelFieldSpecificationsMap);
    
    const allModels = JSON.stringify(_panelSpecificationCollection.modelClassToModelFieldSpecificationsMap, null, 4);
    
    console.log("models JSON", allModels);
    
    // window.open('data:text/plain;charset=utf-8,' + escape(allModels));
    
    console.log("stop");
    console.log("-------------------------------------------------");
}
    