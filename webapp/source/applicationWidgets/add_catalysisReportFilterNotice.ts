import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import sanitizeHTML = require("../sanitizeHTML");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportFilterNotice(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const project = Globals.project();
    const catalysisReportName = Globals.clientState().catalysisReportName();
    if (!catalysisReportName) {
        return;
    }
    const catalysisReportIdentifier = project.findCatalysisReport(catalysisReportName);
    const filter = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_filter");   
    if (filter) {
        const stories = project.storiesForCatalysisReport(catalysisReportIdentifier);
        let storyOrStoriesText = " stories";
        if (stories.length == 1) storyOrStoriesText = " story";
        const labelText = 'This catalysis report only pertains to stories that match the filter "' +  filter + '" (' + stories.length + storyOrStoriesText + ")";
        return m("div", {"class": "questionExternal narrafirma-question-type-filterNotice"}, sanitizeHTML.generateSanitizedHTMLForMithril(labelText));
    } else {
        // it wants a mithril object, so return an empty one
        return m("");
    }
}

export = add_catalysisReportFilterNotice;
