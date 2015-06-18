import CheckBox = require("dijit/form/CheckBox");
import valuePathResolver = require("../valuePathResolver");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_checkbox(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    var readOnly = fieldSpecification.displayReadOnly || false;
    var checkbox = new CheckBox({
        checked: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification),
        readOnly: readOnly
    });
    
    checkbox.placeAt(questionContentPane);
    return checkbox;
}

export = add_checkbox;
