import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");
import translate = require("./panelBuilder/translate");
import m = require("mithril");

"use strict";

// The home page -- should be a constant
var _startPage = "page_dashboard";

// This will hold information about all the panels used
var _panelSpecificationCollection = new PanelSpecificationCollection();

export function startPage(): string {
    return _startPage;
}

export function panelSpecificationCollection() {
    return _panelSpecificationCollection;
}

function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {
    // console.log("addExtraFieldSpecificationsForPageSpecification", pageSpecification.section, pageID, pageSpecification);
    
    function addPageChangeButton(newPageID, idExtra, prompt, displayIconClass) {
        // TODO: Translate
        if (displayIconClass !== "homeButtonImage") {
            var sectionPageSpecification = _panelSpecificationCollection.getPageSpecificationForPageID(newPageID);
            prompt += ": " + sectionPageSpecification.displayName;
        }
        var iconPosition = "left";
        if (displayIconClass === "rightButtonImage") iconPosition = "right";
        var returnToDashboardButtonSpecification = {
            "id": pageID + idExtra,
            "valueType": "none",
            "displayPrompt": prompt,
            "displayType": "button",
            "displayClass": "narrafirma-page-change-button",
            "displayConfiguration": {
                "action": "guiOpenSection",
                "section": newPageID
            },
            displayIconClass: displayIconClass,
            displayPreventBreak: true,
            displayIconPosition: iconPosition
        };
        _panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, returnToDashboardButtonSpecification); 
    }
    
    if (pageSpecification.section !== "dashboard") {
        if (!pageSpecification.isHeader) {
            // TODO: Change the id of this field to have notes or reminder
            // Regular page -- add a footer where the page status can be set
            var statusEntryID = pageID + "_reminders";
            var completionStatusEntryFieldSpecification = {
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
            // console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
            // Put in dashboard
            var childPageIDs = _panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
            // console.log("child pages", pageID, childPageIDs);
            if (!childPageIDs) childPageIDs = [];
            // Add a display to this page for each child page in the same section
            for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                var childPageID = childPageIDs[childPageIndex];
                var statusViewID = childPageID + "_reminders_dashboard";
                var childPageSpecification = _panelSpecificationCollection.getPageSpecificationForPageID(childPageID);
                // console.log("childPageID", childPageSpecification, childPageID);
                if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                if (childPageSpecification && childPageSpecification.displayType === "page") {
                    var prompt = translate(childPageID + "::title", childPageSpecification.displayName);
                    var tooltip = childPageSpecification.tooltipText || null;
                    // Wrap the prompt as a link to the page
                    var properties: any = {
                        href: "javascript:narrafirma_openPage('" + childPageID + "')"
                    }
                    if (childPageSpecification.tooltipText) {
                        properties.title = childPageSpecification.tooltipText;
                    }
                    prompt = m("div.narrafirma-dashboard-page-link", m("a", properties, prompt));
                    if (childPageSpecification.headerAbove) { 
                        prompt = [m("div.narrafirma-dashboard-header", childPageSpecification.headerAbove), prompt]; 
                    }
                    // + " " + translate("#dashboard_status_label", "reminders:")
                    // prompt = prompt  + " ";
                    // console.log("about to call panelBuilder to add one questionAnswer for child page's status", childPageID);
                    var completionStatusDisplayFieldSpecification = {
                        id: statusViewID,
                        valueType: "none",
                        displayType: "questionAnswer",
                        // displayName: prompt,
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
            addPageChangeButton(pageSpecification.previousPageID, "_previousPageButton", "Previous", "leftButtonImage");
        } else {
            addPageChangeButton(_startPage, "_returnToDashboardButton", "Go to home page", "homeButtonImage");
        }
   
        // Add button at bottom of each page to move forward
        if (pageSpecification.nextPageID) {
            addPageChangeButton(pageSpecification.nextPageID, "_nextPageButton", "Next", "rightButtonImage");
        } else {
            addPageChangeButton(_startPage, "_returnToDashboardButton", "Go to home page", "homeButtonImage");
        }
    }
}

export function processAllPanels() {
    var panels = _panelSpecificationCollection.buildListOfPanels();
    // console.log("processAllPanels", panels);
    
    var lastPageID = null;
    var panelIndex;
    var panel;
    
    // Loop to setup navigation
    for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
        panel = panels[panelIndex];
        
        // console.log("defining navigatation for panel", panel.id);

        // For panels that are a "page", add to top level pages choices and set up navigation
        if (panel.displayType === "page") {
            // console.log("pushing page", panel);
            // Make it easy to lookup previous and next pages from a page
            if (!panel.isHeader) {
                var previousPage = _panelSpecificationCollection.getPageSpecificationForPageID(lastPageID);
                previousPage.nextPageID = panel.id;
                panel.previousPageID = lastPageID;
            }
            lastPageID = panel.id;
        }
    }
    
    var lastHeader = null;
    var lastSection = null;
    
    // A separate loop is needed here to ensure page navigation links have been set up when determining additional buttons for pages
    for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
        panel = panels[panelIndex];
        
        if (panel.isHeader) {
            lastHeader = panel.id;
            lastSection = panel.section;
        }
        
        // console.log("defining panel extra fields and help", panel.id);

        // For panels that are a "page", add extra buttons
        if (panel.displayType === "page") {
            addExtraFieldSpecificationsForPageSpecification(panel.id, panel);
        }
        
        panel.helpSection = lastSection;
        panel.helpPage = panel.id;
        panel.sectionHeaderPageID = lastHeader;
        
        for (var fieldIndex = 0; fieldIndex < panel.panelFields.length; fieldIndex++) {
            var fieldSpec = panel.panelFields[fieldIndex];
            fieldSpec.helpSection = lastSection;
            fieldSpec.helpPage = panel.id;
        }
    }
}

// TODO: Temporary for generating JSON navigation data from AMD module
function generateNavigationDataInJSON() {
    var sections = [];
    var sectionBeingProcessed;
    var pageBeingProcessed;
    var allPanels = _panelSpecificationCollection.buildListOfPanels();
    allPanels.forEach(function(panel) {
        // console.log("panel", panel.displayType, panel.id, panel.section, panel.displayName);
        if (panel.isHeader) {
            if (sectionBeingProcessed) sections.push(sectionBeingProcessed);
            sectionBeingProcessed = {
                section: panel.section,
                sectionName: panel.displayName,
                pages: []
            };
        }
        var navigationInfo = {
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
    
    // console.log("JSON for navigation:");
    // console.log(JSON.stringify(sections, null, 4));
}

// TODO: For helping create all the models -- temporary
function printModels() {
    console.log("-------------------------------------------------");
    console.log("panelSpecificationCollection", _panelSpecificationCollection);
    
    console.log("models", _panelSpecificationCollection.modelClassToModelFieldSpecificationsMap);
    
    var allModels = JSON.stringify(_panelSpecificationCollection.modelClassToModelFieldSpecificationsMap, null, 4);
    
    console.log("models JSON", allModels);
    
    // window.open('data:text/plain;charset=utf-8,' + escape(allModels));
    
    console.log("stop");
    console.log("-------------------------------------------------");
}
    