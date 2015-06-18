import TextBox = require("dijit/form/TextBox");
import valuePathResolver = require("../valuePathResolver");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_text(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    
    var readOnly = fieldSpecification.displayReadOnly || false;
    var textBox = new TextBox({
        value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification)
    });
    textBox.set("style", "width: 100%"); // CFK was 40em
    if (readOnly || (fieldSpecification.valueImmutable && valuePathResolver.resolveValueForFieldSpecification(panelBuilder, model, fieldSpecification))) {
        textBox.attr("readOnly", true);
        // textBox.attr("disabled", true);
    }
    textBox.placeAt(questionContentPane);
    return textBox;
}

export = add_text;
