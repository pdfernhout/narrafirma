import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");

"use strict";

function add_catalysisReportQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    console.log("add_catalysisReportQuestionChooser", model, fieldSpecification);
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    // TODO: Who should be responsible for updating this data? Is redraw called or is that bypassed as an html component?
    
    return m("div", [
        prompt,
        m("div", "UNFINISHED")
    ]);
}

export = add_catalysisReportQuestionChooser;
