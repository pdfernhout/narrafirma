import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

// TODO: translate
function stepPlural(count) {
    if (count === 1) return "step";
    return "steps";
}

// this is no longer being used but we'll keep it just in case we want it again later
function add_dashboardSectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    const sectionName = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
    
    // TODO: Kludge of using field id to determine what section this refers to
    const pageID = fieldSpecification.id.replace("project_launchSection_", "page_");
    let childPageIDs;
    
    // This collection could be null during testing
    const panelSpecificationCollection = panelBuilder.panelSpecificationCollection;
    if (!panelSpecificationCollection) {
        const errorMessage = "ERROR: panelBuilder.panelSpecificationCollection is null";
        console.log("ERROR", errorMessage);
        return m("div", {"class": "errorMessage"}, errorMessage);
    }
    
    childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
    if (!childPageIDs) childPageIDs = [];
    
    const pageStatus = {
        "completely finished": 0,
        "partially done": 0,
        "intentionally skipped": 0,
        "null": 0,
        "undefined": 0
    };
    
    for (let childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
        const childPageID = childPageIDs[childPageIndex];
        const statusViewID = childPageID + "_pageStatus";
        // TODO: Fix if different sections get split up
        const status = Globals.project().tripleStore.queryLatestC(model, statusViewID);
        let count = pageStatus["" + status] || 0;
        count++;
        pageStatus["" + status] = count;
    }
    
    let pageCount = 0;
    for (const key in pageStatus) {
        pageCount += pageStatus[key];
    }
    
    const unfinishedPageCount = pageStatus["undefined"] + pageStatus["null"] + pageStatus["partially done"];
    const finishedPageCount = pageStatus["completely finished"] + pageStatus["intentionally skipped"];
    
    let percentDone = 0;
    if (pageCount) percentDone = Math.round(100 * finishedPageCount / pageCount);
    
    // TODO: No longer need to calculate statusText? Probably should remove this...
    // TODO: Translate
    let statusText = " -- All " + pageCount + " steps complete (100%)";
    if (unfinishedPageCount) {
        statusText = "" + finishedPageCount + " " + stepPlural(finishedPageCount) + " of " + pageCount + " complete (" + percentDone + "%)";
    }
    
    if (pageCount === 0) statusText = "";
    
    // if (fieldSpecification.displayClass) options.class = fieldSpecification.displayClass;
    // if (fieldSpecification.displayIconClass) options.iconClass = fieldSpecification.displayIconClass;

    const callback = panelBuilder.buttonClicked.bind(panelBuilder, model, fieldSpecification);
 
    const options: any = {
        onclick: callback,
        "class": "narrafirma-dashboardStatusButton"
    };
    
    const button = m("button", options, sectionName);

    // TODO: Improve the naming of displayPreventBreak, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else

    return [button, m("br")];
    // return [button, statusText];

    // TODO: Need to rethinking what this does for changes elsewhere to page status storage to reminders
    //statusText = "";
    
    //const htmlText = '<span class="narrafirma-dashboardSectionStatusDisplayCompletion">' + statusText + '</span><br>';
    //panelBuilder.addHTML(contentPane, htmlText);
}

export = add_dashboardSectionStatusDisplay;
