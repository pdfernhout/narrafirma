define([
    "dojox/mvc/at",
    "js/domain",
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    at,
    domain,
    lang,
    translate
){
    "use strict";
    
    // TODO: translate
    function stepPlural(count) {
        if (count === 1) return "step";
        return "steps";
    }
    
    function add_annotationsGrid(panelBuilder, contentPane, model, fieldSpecification) {
        var sectionName = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        
        // TODO: Kludge of using field id to determine what section this refers to
        var pageID = fieldSpecification.id.replace("project_launchSection_", "page_");
        
        var childPageIDs = domain.childPageIDListForHeaderID[pageID];
        console.log("child pages", pageID, childPageIDs);
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
            console.log("statusViewID", fieldSpecification.id, statusViewID);
            // TODO: Fix if different sections get split up
            var status = model.get(statusViewID);
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
        
        // TODO: Translate
        var statusText = " -- All " + pageCount + " steps complete (100%)";
        if (unfinishedPageCount) {
            statusText = " -- " + finishedPageCount + " " + stepPlural(finishedPageCount) + " of " + pageCount + " complete (" + percentDone + "%)";
        }
        
        if (pageCount === 0) statusText = "";
        
        console.log("statusText for pageStatus", statusText, pageStatus);
        // var statusText = "Unfinished count: " + pageCount + " with: " + JSON.stringify(pageStatus);
        
        var statusSpecification = {
            id: fieldSpecification.id + "_status",
            displayType: "label",
            displayPrompt: statusText,
        };
        // var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, statusSpecification);
        
        /*
        var label = panelBuilder.newContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            // content: "<b>" + statusText + "</b>" 
            content: statusText
        });
        label.placeAt(questionContentPane);
        */
        
        var buttonFieldSpecification = {
            id: fieldSpecification.id + "_button",
            displayType: "button",
            // TODO: Translate
            displayPrompt: "<b>" + sectionName + "</b>" + statusText,
            displayConfiguration: fieldSpecification.displayConfiguration
            };
        var button = panelBuilder.addQuestionWidget(contentPane, model, buttonFieldSpecification);
        
        // return label;
        return button;
    }

    return add_annotationsGrid;
});