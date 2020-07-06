import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_questionsTable(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m("div", "add_questionsTable UNFINISHED");
    
    // TODO: Fix for Mithril
    /*
    const questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(fieldSpecification);
    
    const label = panelBuilder.newContentPane({
        // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
        content: "<b>UNFINISHED add_questionsTable: " + fieldSpecification.id + "</b>"             
    });
    label.placeAt(questionContentPane);
    return label;
    */
}

export = add_questionsTable;
