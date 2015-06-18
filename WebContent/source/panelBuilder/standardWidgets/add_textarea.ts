import SimpleTextarea = require("dijit/form/SimpleTextarea");
import valuePathResolver = require("../valuePathResolver");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_textarea(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification); 
    var textarea = new SimpleTextarea({
        rows: "4",
        cols: "80",
        style: "width: 100%;", // CFK changed from width: auto
        value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
    });
    textarea.placeAt(questionContentPane);
    return textarea;
}

export = add_textarea;
