import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import PatternExplorer = require("./PatternExplorer");

"use strict";

function add_patternExplorer(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var patternBrowser = m.component(<any>PatternExplorer, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
 
    return m("div", [
        prompt,
        patternBrowser
     ]);
}

export = add_patternExplorer;
