import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_annotationsGrid(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m("div", "add_annotationsGrid UNFINISHED");
    
    // TODO: Fix for Mithril
    /*
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(fieldSpecification);
    
    var label = panelBuilder.newContentPane({
        // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
        content: "<b>UNFINISHED add_annotationsGrid: " + fieldSpecification.id + "</b>"             
    });
    label.placeAt(questionContentPane);
    return label;
    */
}

export = add_annotationsGrid;
