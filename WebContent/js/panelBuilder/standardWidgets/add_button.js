define([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "../translate"
], function(
    at,
    Button,
    ContentPane,
    domClass,
    domConstruct,
    lang,
    translate
){
    "use strict";
    
    function add_button(panelBuilder, contentPane, model, fieldSpecification, callback) {
        if (!callback) callback = lang.hitch(panelBuilder, panelBuilder.buttonClicked, contentPane, model, fieldSpecification);
        
        var button = new Button({
            label: translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt),
            type: "button",
            onClick: callback
        });
        
        if (fieldSpecification.displayClass) domClass.add(button.domNode, fieldSpecification.displayClass);

        button.placeAt(contentPane);
        
        // TODO: Improve the naming of this, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else
        if (!fieldSpecification.displayPreventBreak) {
            domConstruct.place("<br>", contentPane.domNode);
        }
        
        return button;
    }

    return add_button;
});