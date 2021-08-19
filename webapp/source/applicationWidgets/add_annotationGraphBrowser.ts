import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import AnnotationGraphBrowser = require("./AnnotationGraphBrowser");

"use strict";

function add_annotationGraphBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var graphBrowser = m.component(<any>AnnotationGraphBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
    // insertGraphBrowser(panelBuilder, model, fieldSpecification);

    return m("div", [
        prompt,
        graphBrowser
     ]);
}

export = add_annotationGraphBrowser;
