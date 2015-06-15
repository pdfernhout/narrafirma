define(["require", "exports", "../translate"], function (require, exports, translate) {
    "use strict";
    function add_header(panelBuilder, contentPane, model, fieldSpecification) {
        var content = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        if (panelBuilder.addHelpIcons) {
            content = panelBuilder.htmlForInformationIcon(panelBuilder.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + content;
        }
        var label = panelBuilder.newContentPane({
            content: content,
            class: "narrafirma-question-header"
        });
        label.placeAt(contentPane);
        return label;
    }
    return add_header;
});
//# sourceMappingURL=add_header.js.map