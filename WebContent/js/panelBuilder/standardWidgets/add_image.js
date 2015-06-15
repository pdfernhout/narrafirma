define(["require", "exports", "../translate"], function (require, exports, translate) {
    "use strict";
    function add_image(panelBuilder, contentPane, model, fieldSpecification) {
        var imageSource = fieldSpecification.displayConfiguration;
        var questionText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");
        var image = panelBuilder.newContentPane({
            content: questionText + "<br>" + '<img src="' + panelBuilder.applicationDirectory + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        image.placeAt(contentPane);
        return image;
    }
    return add_image;
});
//# sourceMappingURL=add_image.js.map