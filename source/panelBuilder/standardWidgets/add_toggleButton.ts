define([
    "dijit/form/ToggleButton",
    "../valuePathResolver"
], function(
    ToggleButton,
    valuePathResolver
){
    "use strict";
    
    function add_toggleButton(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        // Toggle button maintains a "checked" flag, so we need to set value ourselves
        var toggleButton = new ToggleButton({
            label: "" + model.get(fieldSpecification.id),
            value: valuePathResolver.atFieldSpecification(panelBuilder, model, fieldSpecification),
            onChange: function(value) {
                this.set("label", value);
                this.set("value", value);
                panelBuilder.buttonClicked(contentPane, model, fieldSpecification, value);
            }
        });
        
        toggleButton.placeAt(questionContentPane);
        
        return toggleButton;
    }

    return add_toggleButton;
});