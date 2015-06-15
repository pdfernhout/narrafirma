define(["require", "exports", "dijit/form/CheckBox", "../valuePathResolver"], function (require, exports, CheckBox, valuePathResolver) {
    "use strict";
    function add_checkbox(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var readOnly = fieldSpecification.displayReadOnly || false;
        var checkbox = new CheckBox({
            checked: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification),
            readOnly: readOnly
        });
        checkbox.placeAt(questionContentPane);
        return checkbox;
    }
    return add_checkbox;
});
//# sourceMappingURL=add_checkbox.js.map