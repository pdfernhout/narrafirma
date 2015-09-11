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

function add_dashboardSectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    var sectionName = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
    
    // TODO: Kludge of using field id to determine what section this refers to
    var pageID = fieldSpecification.id.replace("project_launchSection_", "page_");
    
    var childPageIDs;
    
    // This collection could be null during testing
    var panelSpecificationCollection = panelBuilder.panelSpecificationCollection;
    if (!panelSpecificationCollection) {
        var errorMessage = "ERROR: panelBuilder.panelSpecificationCollection is null";
        console.log("ERROR", errorMessage);
        return m("div", {"class": "errorMessage"}, errorMessage);
    }
    
    childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
    // console.log("child pages", pageID, childPageIDs);
    if (!childPageIDs) childPageIDs = [];
    
    var pageStatus = {
        "completely finished": 0,
        "partially done": 0,
        "intentionally skipped": 0,
        "null": 0,
        "undefined": 0
    };
    
    for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
        var childPageID = childPageIDs[childPageIndex];
        var statusViewID = childPageID + "_pageStatus";
        // console.log("statusViewID", fieldSpecification.id, statusViewID);
        // TODO: Fix if different sections get split up
        var status = Globals.project().tripleStore.queryLatestC(model, statusViewID);
        var count = pageStatus["" + status] || 0;
        count++;
        pageStatus["" + status] = count;
    }
    
    var pageCount = 0;
    for (var key in pageStatus) {
        pageCount += pageStatus[key];
    }
    
    var unfinishedPageCount = pageStatus["undefined"] + pageStatus["null"] + pageStatus["partially done"];
    var finishedPageCount = pageStatus["completely finished"] + pageStatus["intentionally skipped"];
    
    var percentDone = 0;
    if (pageCount) percentDone = Math.round(100 * finishedPageCount / pageCount);
    
    // TODO: No longer need to calculate statusText? Probably should rmeove this...
    // TODO: Translate
    var statusText = " -- All " + pageCount + " steps complete (100%)";
    if (unfinishedPageCount) {
        statusText = "" + finishedPageCount + " " + stepPlural(finishedPageCount) + " of " + pageCount + " complete (" + percentDone + "%)";
    }
    
    if (pageCount === 0) statusText = "";
    
    // console.log("statusText for pageStatus", statusText, pageStatus);
    
    // if (fieldSpecification.displayClass) options.class = fieldSpecification.displayClass;
    // if (fieldSpecification.displayIconClass) options.iconClass = fieldSpecification.displayIconClass;

    var callback = panelBuilder.buttonClicked.bind(panelBuilder, model, fieldSpecification);
 
    var options: any = {
        onclick: callback,
        "class": "narrafirma-dashboardStatusButton"
    };
    
    var button = m("button", options, sectionName);

    // TODO: Improve the naming of displayPreventBreak, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else

    return [button, m("br")];
    // return [button, statusText];

    // TODO: Need to rethinking what this does for changes elsewhere to page status storage to reminders
    //statusText = "";
    
    //var htmlText = '<span class="narrafirma-dashboardSectionStatusDisplayCompletion">' + statusText + '</span><br>';
    //panelBuilder.addHTML(contentPane, htmlText);
}

export = add_dashboardSectionStatusDisplay;
