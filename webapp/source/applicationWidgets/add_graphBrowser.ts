import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import GraphBrowser = require("./GraphBrowser");

"use strict";

function add_graphBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var graphBrowser = m.component(<any>GraphBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
    // insertGraphBrowser(panelBuilder, model, fieldSpecification);

    return m("div", [
        prompt,
        graphBrowser
     ]);
}

export = add_graphBrowser;
