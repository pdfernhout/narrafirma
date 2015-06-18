import kludgeForUseStrict = require("../kludgeForUseStrict");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
"use strict";

function add_annotationsGrid(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    var label = panelBuilder.newContentPane({
        // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
        content: "<b>UNFINISHED add_annotationsGrid: " + fieldSpecification.id + "</b>"             
    });
    label.placeAt(questionContentPane);
    return label;
}

export = add_annotationsGrid;
