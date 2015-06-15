define(["require", "exports", "dijit/form/Button", "dojo/dom-class", "dojo/dom-construct", "../translate"], function (require, exports, Button, domClass, domConstruct, translate) {
    "use strict";
    function add_button(panelBuilder, contentPane, model, fieldSpecification, callback) {
        if (!callback)
            callback = panelBuilder.buttonClicked.bind(panelBuilder, contentPane, model, fieldSpecification);
        var button = new Button({
            label: translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt),
            type: "button",
            onClick: callback
        });
        if (fieldSpecification.displayClass)
            domClass.add(button.domNode, fieldSpecification.displayClass);
        if (fieldSpecification.displayIconClass)
            button.set("iconClass", fieldSpecification.displayIconClass);
        button.placeAt(contentPane);
        // TODO: Improve the naming of this, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else
        if (!fieldSpecification.displayPreventBreak) {
            domConstruct.place("<br>", contentPane.domNode);
        }
        return button;
    }
    return add_button;
});
//# sourceMappingURL=add_button.js.map