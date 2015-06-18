import translate = require("../translate");
import PanelBuilder = require("../PanelBuilder");

"use strict";

function add_image(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var imageSource = fieldSpecification.displayConfiguration;
    var questionText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");
    var image = panelBuilder.newContentPane({
        content: questionText + "<br>" + '<img src="' + panelBuilder.applicationDirectory + imageSource + '" alt="Image for question: ' + questionText + '">'
    });
    image.placeAt(contentPane);
    return image;
}

export = add_image;
