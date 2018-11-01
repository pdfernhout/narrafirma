import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportFilterNotice(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    var catalysisReportName = Globals.clientState().catalysisReportName();
    if (!catalysisReportName) {
        return;
    }
    var catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);
    var filter = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_filter");   
    if (filter) {
        var stories = project.storiesForCatalysisReport(catalysisReportIdentifier);
        var storyOrStoriesText = " stories";
        if (stories.length == 1) storyOrStoriesText = " story";
        var labelText = 'This catalysis report only pertains to stories that match the filter "' +  filter + '" (' + stories.length + storyOrStoriesText + ")";
        return m("div", {"class": "questionExternal narrafirma-question-type-filterNotice"}, sanitizeHTML.generateSanitizedHTMLForMithril(labelText));
    } else {
        // it wants a mithril object, so return an empty one
        return m("");
    }
}

export = add_catalysisReportFilterNotice;
