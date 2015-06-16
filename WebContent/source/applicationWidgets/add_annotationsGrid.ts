import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

function add_annotationsGrid(panelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    var label = panelBuilder.newContentPane({
        // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
        content: "<b>UNFINISHED add_annotationsGrid: " + fieldSpecification.id + "</b>"             
    });
    label.placeAt(questionContentPane);
    return label;
}

export = add_annotationsGrid;
