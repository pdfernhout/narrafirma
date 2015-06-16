define(["require", "exports"], function (require, exports) {
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
    return add_annotationsGrid;
});
//# sourceMappingURL=add_annotationsGrid.js.map