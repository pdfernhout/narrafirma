import translate = require("../translate");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_label(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var content = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
    if (panelBuilder.addHelpIcons) {
        content = panelBuilder.htmlForInformationIcon(panelBuilder.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + content;
    }
    var label = panelBuilder.newContentPane({
        content: content
    });
    label.placeAt(contentPane);
    return label;
}

export = add_label;
