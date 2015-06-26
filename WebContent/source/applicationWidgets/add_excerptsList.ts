import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_excerptsList(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m("div", "add_excerptsList UNFINISHED");
    
    // TODO: Fix for Mithril
    /*
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(fieldSpecification);
    
    var label = panelBuilder.newContentPane({
        // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
        content: "<b>UNFINISHED add_excerptsList: " + fieldSpecification.id + "</b>"             
    });
    label.placeAt(questionContentPane);
    return label;
    */
}

export = add_excerptsList;
