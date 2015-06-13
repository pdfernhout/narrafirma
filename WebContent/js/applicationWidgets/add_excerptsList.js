define([
], function () {
    "use strict";
    function add_excerptsList(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var label = panelBuilder.newContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_excerptsList: " + fieldSpecification.id + "</b>"
        });
        label.placeAt(questionContentPane);
        return label;
    }
    return add_excerptsList;
});
