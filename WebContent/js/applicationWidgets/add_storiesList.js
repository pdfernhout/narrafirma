"use strict";
define(["require", "exports"], function (require, exports) {
    function add_storiesList(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var label = panelBuilder.newContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_storiesList: " + fieldSpecification.id + "</b>"
        });
        label.placeAt(questionContentPane);
        return label;
    }
    return add_storiesList;
});
//# sourceMappingURL=add_storiesList.js.map